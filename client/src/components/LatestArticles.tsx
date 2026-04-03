import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { ArticleDocument } from "@shared/schema";

export default function LatestArticles() {
  const { data: articles, isLoading } = useQuery<ArticleDocument[]>({
    queryKey: ["/api/articles"],
  });

  // Only show the 3 most recent articles
  const latestArticles = articles?.slice(0, 3) || [];

  // Analytics: Track batch impressions
  useEffect(() => {
    if (latestArticles.length > 0) {
      const ids = latestArticles.map(a => a._id);
      apiRequest("POST", "/api/articles/impressions", { ids });
    }
  }, [latestArticles.length]);

  if (!isLoading && latestArticles.length === 0) return null;

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
              Latest Articles
            </h2>
            <p className="text-lg text-muted-foreground">
              Sharing my thoughts and insights on web development and modern technology.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/articles">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))
          ) : (
            latestArticles.map((article) => (
              <Link key={article._id?.toString()} href={`/articles/${article.slug}`}>
                <Card className="group h-full cursor-pointer border border-border bg-card hover-elevate transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/articles">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
