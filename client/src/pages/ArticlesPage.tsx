import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import type { ArticleDocument } from "@shared/schema";

export default function ArticlesPage() {
  const { data: articles, isLoading } = useQuery<ArticleDocument[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <>
      <SEO 
        title="Articles" 
        description="Explore my thoughts on web development, design patterns, and modern technology. Articles, tutorials, and insights from the mind of Daniel Dawodu."
      />
      
      <main className="py-16 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Articles & Ideas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of my thoughts, deep-dives into technologies, and shared experiences from my development journey.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Check back soon for new insights and stories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article._id?.toString()} href={`/articles/${article.slug}`}>
                  <Card className="group h-full cursor-pointer border border-border bg-card hover-elevate transition-all duration-300">
                    {article.imageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3 mb-6">
                        {article.description}
                      </p>
                      <Button variant="ghost" className="p-0 hover:bg-transparent text-primary group-hover:translate-x-2 transition-transform">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
