import mongoose, { Schema, type Document } from "mongoose";
import { z } from "zod";

// --- Models ---

// User Model (Admin)
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

// Article Model
const articleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // HTML from TipTap
  description: { type: String, required: true }, // SEO Meta
  imageUrl: { type: String }, // Optional preview
  resources: [{ 
    name: { type: String, required: true }, 
    url: { type: String, required: true } 
  }], // Clickable links/files
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

// Comment Model
const commentSchema = new Schema({
  articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

// --- Validation Schemas (Zod) ---

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().min(1, "SEO Description is required"),
  imageUrl: z.string().optional(),
  resources: z.array(z.object({
    name: z.string().min(1, "Resource name is required"),
    url: z.string().url("Valid URL is required")
  })).optional(),
  status: z.enum(["draft", "published"]),
});

export const insertCommentSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  author: z.string().min(1, "Your Name is required"),
  content: z.string().min(1, "Your Comment is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export interface UserDocument extends Document {
  username: string;
  password?: string;
}

export interface ArticleDocument extends Document {
  title: string;
  slug: string;
  content: string;
  description: string;
  imageUrl?: string;
  resources?: { name: string; url: string }[];
  views: number;
  impressions: number;
  status: "draft" | "published";
  publishedAt: Date;
}

export interface CommentDocument extends Document {
  articleId: mongoose.Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
}
