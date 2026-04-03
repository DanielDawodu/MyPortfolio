import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Calendar, Share2, Linkedin, Twitter, 
  Link as LinkIcon, MessageSquare, User, Send, Trash2, Loader2 
} from "lucide-react";
import { format } from "date-fns";
import parse from "html-react-parser";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import type { ArticleDocument } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: article, isLoading, error } = useQuery<ArticleDocument>({
    queryKey: [`/api/articles/${slug}`],
  });

  // Analytics: Track full page view
  useEffect(() => {
    if (article?._id) {
      apiRequest("POST", `/api/articles/${article._id}/view`);
    }
  }, [article?._id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Article URL copied to your clipboard.",
    });
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`Check out this article: "${article?.title}" by @danieldawodu95 \n\n#DanielDawodu #WebDevelopment`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-64 w-full mb-12" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center py-32">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/articles">Back to Articles</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={article.title} 
        description={article.description} 
        image={article.imageUrl}
        type="article"
        publishedAt={article.publishedAt.toString()}
      />

      <main className="py-16 md:py-24 lg:py-32">
        <article className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild className="hover:bg-transparent -ml-2">
              <Link href="/articles">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>
            </Button>
          </div>

          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
              <span className="mx-2">•</span>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider font-semibold">Share:</span>
                <button 
                  onClick={shareOnX}
                  className="hover:text-primary transition-colors hover:scale-110"
                  aria-label="Share on X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  onClick={shareOnLinkedIn}
                  className="hover:text-primary transition-colors hover:scale-110"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="hover:text-primary transition-colors hover:scale-110"
                  aria-label="Copy Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {article.title}
            </h1>
            {article.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-xl">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-16 prose-headings:font-bold prose-a:text-primary">
            {parse(article.content)}
          </div>

          {/* New Resources & Attachments Section */}
          {article.resources && article.resources.length > 0 && (
            <div className="mb-16 p-8 rounded-2xl bg-muted/30 border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Resources & Attachments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.resources.map((res: any, idx: number) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-md hover:border-primary group"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {res.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {new URL(res.url).hostname ?? res.url}
                      </span>
                    </div>
                    <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-12 text-center mb-16">
            <h3 className="text-xl font-bold mb-4">Enjoyed this article?</h3>
            <div className="flex justify-center gap-4">
              <Button onClick={shareOnX} className="bg-black hover:bg-black/80 text-white flex gap-2">
                <Twitter className="w-4 h-4" />
                Post on X
              </Button>
              <Button onClick={shareOnLinkedIn} className="bg-[#0077b5] hover:bg-[#0077b5]/80 text-white flex gap-2">
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <CommentsSection articleId={String(article._id)} />
        </article>
      </main>

      <Footer />
    </>
  );
}

function CommentsSection({ articleId }: { articleId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useQuery<any[]>({
    queryKey: [`/api/articles/${articleId}/comments`],
  });

  const commentMutation = useMutation({
    mutationFn: async (data: { author: string; content: string }) => {
      await apiRequest("POST", `/api/articles/${articleId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${articleId}/comments`] });
      setAuthor("");
      setContent("");
      toast({ title: "Comment Posted!", description: "Thanks for sharing your thoughts." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    commentMutation.mutate({ author, content });
  };

  return (
    <div className="space-y-12 border-t border-border pt-16">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Comments ({comments?.length || 0})
        </h2>
        <p className="text-muted-foreground">Join the conversation and share your thoughts.</p>
      </div>

      {/* Comment Form */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input 
                placeholder="John Doe" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Message</label>
            <Textarea 
              placeholder="Write your thoughts here..." 
              className="min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={commentMutation.isPending}
            className="w-full md:w-auto"
          >
            {commentMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Post Comment
          </Button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 p-6 bg-muted/10 border border-border rounded-xl transition-all hover:bg-muted/20">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">{comment.author}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed italic">
                  "{comment.content}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
