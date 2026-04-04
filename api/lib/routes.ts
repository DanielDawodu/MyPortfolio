import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertArticleSchema } from "@shared/schema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import slugify from "slugify";
import { User } from "@shared/schema";
import { upload } from "./cloudinary.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // --- Session & Auth Setup ---
  if (!process.env.SESSION_SECRET) {
    console.warn("⚠️ SESSION_SECRET not set, using default key");
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is MISSING. Session store will fail.");
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "daniels_secret_key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 7, // 1 week
        autoRemove: "native",
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  console.log("✅ Session Store Initialized with MongoDB");

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || user.password !== password) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user._id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- Auth Routes ---

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Temporary route to create the first admin (user should call this once)
  app.post("/api/admin/setup", async (req, res) => {
    const { username, password, secret } = req.body;
    // Basic protection for this setup route
    if (secret !== "daniels_portfolio_setup_2024") {
      return res.status(403).json({ message: "Invalid setup secret" });
    }
    const existing = await storage.getUserByUsername(username);
    if (existing) return res.status(400).json({ message: "User already exists" });
    
    const user = await storage.createUser({ username, password });
    res.json({ message: "Admin created successfully", user: { username: user.username } });
  });

  // --- Article Routes ---

  // Read all published articles
  app.get("/api/articles", async (req, res) => {
    const articles = await storage.getArticles();
    // In public view, maybe filter by status if needed, or just return all for now
    res.json(articles);
  });

  // Read single article by slug
  app.get("/api/articles/:slug", async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  });

  // Protected Routes Middleware
  const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  // Create article
  app.post("/api/articles", ensureAuthenticated, async (req, res) => {
    const result = insertArticleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    const slug = slugify(result.data.title, { lower: true, strict: true });
    const article = await storage.createArticle({ ...result.data, slug });
    res.status(201).json(article);
  });

  // Update article
  app.patch("/api/articles/:id", ensureAuthenticated, async (req, res) => {
    const article = await storage.updateArticle(req.params.id, req.body);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  });

  // Delete article
  app.delete("/api/articles/:id", ensureAuthenticated, async (req, res) => {
    const success = await storage.deleteArticle(req.params.id);
    if (!success) return res.status(404).json({ message: "Article not found" });
    res.sendStatus(200);
  });

  // Media Upload (Cloudinary)
  app.post("/api/upload", ensureAuthenticated, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // req.file.path is the Cloudinary URL
      res.json({ url: (req.file as any).path });
    } catch (err: any) {
      console.error("❌ Cloudinary Upload Error Details:", {
        message: err.message,
        stack: err.stack,
        details: err
      });
      res.status(500).json({ 
        message: "Upload failed", 
        error: err.message || "Unknown error" 
      });
    }
  });

  // Analytics: Track View
  app.post("/api/articles/:id/view", async (req, res) => {
    await storage.incrementArticleViews(req.params.id);
    res.sendStatus(200);
  });

  // Analytics: Track Impressions (Batch)
  app.post("/api/articles/impressions", async (req, res) => {
    const { ids } = req.body;
    if (Array.isArray(ids)) {
      await storage.incrementArticleImpressions(ids);
    }
    res.sendStatus(200);
  });

  // Comments: Fetch for article
  app.get("/api/articles/:id/comments", async (req, res) => {
    const comments = await storage.getComments(req.params.id);
    res.json(comments);
  });

  // Comments: Post new
  app.post("/api/articles/:id/comments", async (req, res) => {
    try {
      const commentData = {
        articleId: req.params.id,
        author: req.body.author,
        content: req.body.content,
      };
      const result = await storage.createComment(commentData);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Comments: Moderate (Delete)
  app.delete("/api/comments/:id", ensureAuthenticated, async (req, res) => {
    const success = await storage.deleteComment(req.params.id);
    if (!success) return res.status(404).json({ message: "Comment not found" });
    res.sendStatus(200);
  });

  // Comments: Get all (Admin)
  app.get("/api/comments", ensureAuthenticated, async (req, res) => {
    const comments = await storage.getAllComments();
    res.json(comments);
  });

  const httpServer = createServer(app);
  return httpServer;
}
