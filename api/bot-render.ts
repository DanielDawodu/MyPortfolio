import { storage } from "./lib/storage.js";
import fs from "fs";
import path from "path";

// Bot detection regex
const BOT_AGENTS = /Twitterbot|facebookexternalhit|WhatsApp|LinkedInBot|googlebot|bingbot|slackbot|discordbot/i;

export default async function handler(req: any, res: any) {
  const userAgent = req.headers["user-agent"] || "";
  const { slug } = req.query;

  try {
    const article = await storage.getArticleBySlug(slug as string);
    
    // If it's a bot, serve the injected HTML
    if (BOT_AGENTS.test(userAgent)) {
      if (!article) {
        return res.status(404).send("Article not found");
      }

      const host = req.headers.host;
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const siteUrl = `${protocol}://${host}`;
      const fullUrl = `${siteUrl}/articles/${slug}`;
      const imageUrl = article.imageUrl || `${siteUrl}/og-image.png`;
      const siteName = "Daniel Dawodu | Professional Web Developer";
      const fullTitle = `${article.title} | ${siteName}`;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullTitle}</title>
    <meta name="description" content="${article.description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${fullUrl}">
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:image" content="${imageUrl}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${fullUrl}">
    <meta property="twitter:title" content="${fullTitle}">
    <meta property="twitter:description" content="${article.description}">
    <meta property="twitter:image" content="${imageUrl}">
</head>
<body>
    <h1>${article.title}</h1>
    <p>${article.description}</p>
    <img src="${imageUrl}" alt="${article.title}">
    <script>window.location.href = "${fullUrl}";</script>
</body>
</html>
      `.trim();

      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    }

    // For regular users, serve the standard index.html
    // In Vercel, we need to find where the frontend's index.html lives.
    // Since everything is built into the same project, we can try to read it.
    // If reading fails, we'll return a minimal bootstrap HTML or a fallback.
    try {
      const indexPath = path.join(process.cwd(), "client", "index.html");
      const html = fs.readFileSync(indexPath, "utf8");
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    } catch (fsError) {
      // Fallback: minimal HTML that loads the React app
      // We expect the vite build to have placed assets at the root or /assets
      // This is just a safety net.
      return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Daniel Dawodu</title><script type="module" src="/src/main.tsx"></script></head>
<body><div id="root"></div></body>
</html>
      `);
    }

  } catch (error) {
    console.error("Bot rendering error:", error);
    // On error, try to serve the regular app
    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Daniel Dawodu</title><script type="module" src="/src/main.tsx"></script></head>
<body><div id="root"></div></body>
</html>
    `);
  }
}
