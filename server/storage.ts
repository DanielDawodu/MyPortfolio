import { 
  User, Article, Comment, 
  type InsertUser, type InsertArticle, type InsertComment, 
  type ArticleDocument, type CommentDocument 
} from "@shared/schema";
import mongoose from "mongoose";

export interface IStorage {
  // User CRUD
  getUser(id: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  createUser(user: InsertUser): Promise<any>;

  // Article CRUD
  getArticles(): Promise<ArticleDocument[]>;
  getArticleBySlug(slug: string): Promise<ArticleDocument | null>;
  createArticle(article: InsertArticle & { slug: string }): Promise<ArticleDocument>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<ArticleDocument | null>;
  deleteArticle(id: string): Promise<boolean>;
  incrementArticleViews(id: string): Promise<void>;
  incrementArticleImpressions(ids: string[]): Promise<void>;

  // Comment CRUD
  getComments(articleId: string): Promise<CommentDocument[]>;
  getAllComments(): Promise<CommentDocument[]>;
  createComment(comment: InsertComment): Promise<CommentDocument>;
  deleteComment(id: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  // User CRUD
  async getUser(id: string): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<any | null> {
    return await User.findOne({ username });
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    const user = new User(insertUser);
    return await user.save();
  }

  // Article CRUD
  async getArticles(): Promise<ArticleDocument[]> {
    return await Article.find().sort({ publishedAt: -1 });
  }

  async getArticleBySlug(slug: string): Promise<ArticleDocument | null> {
    return await Article.findOne({ slug });
  }

  async createArticle(articleData: InsertArticle & { slug: string }): Promise<ArticleDocument> {
    const article = new Article(articleData);
    return await article.save();
  }

  async updateArticle(id: string, articleData: Partial<InsertArticle>): Promise<ArticleDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Article.findByIdAndUpdate(id, articleData, { new: true });
  }

  async deleteArticle(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Article.findByIdAndDelete(id);
    return !!result;
  }

  async incrementArticleViews(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    await Article.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async incrementArticleImpressions(ids: string[]): Promise<void> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) return;
    await Article.updateMany(
      { _id: { $in: validIds } },
      { $inc: { impressions: 1 } }
    );
  }

  // Comment CRUD
  async getComments(articleId: string): Promise<CommentDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(articleId)) return [];
    return await Comment.find({ articleId }).sort({ createdAt: -1 });
  }

  async getAllComments(): Promise<CommentDocument[]> {
    return await Comment.find().sort({ createdAt: -1 });
  }

  async createComment(commentData: InsertComment): Promise<CommentDocument> {
    const comment = new Comment(commentData);
    return await comment.save();
  }

  async deleteComment(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Comment.findByIdAndDelete(id);
    return !!result;
  }
}

export const storage = new MongoStorage();
