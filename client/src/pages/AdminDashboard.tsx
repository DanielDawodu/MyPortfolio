import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Plus, Pencil, Trash2, LogOut, 
  Loader2, Save, X, Eye, BarChart3, 
  MessageSquare, User 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TipTapEditor from "@/components/TipTapEditor";
import type { ArticleDocument } from "@shared/schema";

export default function AdminDashboard() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleDocument | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    resources: [] as { name: string; url: string }[],
    status: "draft" as "draft" | "published"
  });

  const { data: articles, isLoading: isArticlesLoading } = useQuery<ArticleDocument[]>({
    queryKey: ["/api/articles"],
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingArticle) {
        return await apiRequest("PATCH", `/api/articles/${editingArticle._id}`, data);
      } else {
        return await apiRequest("POST", "/api/articles", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: `Article ${editingArticle ? "Updated" : "Created"}` });
      closeEditor();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article Deleted" });
    },
  });

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <Redirect href="/admin/login" />;

  const openEditor = (article?: ArticleDocument) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.imageUrl || "",
        resources: article.resources || [],
        status: article.status
      });
    } else {
      setEditingArticle(null);
      setFormData({ title: "", description: "", content: "", imageUrl: "", resources: [], status: "draft" });
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertMutation.mutateAsync(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Badge variant="outline">Logged in as {user.username}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="articles" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Portfolio Management</h2>
              <p className="text-muted-foreground">Manage your articles, analytics, and visitor engagement.</p>
            </div>
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">All Articles</h3>
                <p className="text-sm text-muted-foreground">Track performance and edit your content.</p>
              </div>
              <Button onClick={() => openEditor()}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>

            {isArticlesLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8" /></div>
            ) : (
              <div className="border border-border rounded-xl bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!articles || articles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                          No articles found. Create your first one!
                        </TableCell>
                      </TableRow>
                    ) : (
                      articles.map((article) => (
                        <TableRow key={article._id?.toString()}>
                          <TableCell className="font-medium max-w-[200px] truncate">{article.title}</TableCell>
                          <TableCell>
                            <Badge variant={article.status === "published" ? "default" : "secondary"}>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1" title="Page Views">
                                <Eye className="w-4 h-4 text-primary" />
                                <span>{article.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1" title="Home Impressions">
                                <BarChart3 className="w-4 h-4 text-blue-500" />
                                <span>{article.impressions || 0}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {format(new Date(article.publishedAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditor(article)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this article?")) {
                                    deleteMutation.mutate(String(article._id));
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            <ModerationTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b border-border flex-row items-center justify-between">
            <DialogTitle className="text-2xl mt-0">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeEditor}>Cancel</Button>
              <Button onClick={handleSave} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Save className="mr-2 w-4 h-4" />}
                {editingArticle ? "Update" : "Publish"}
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Article Title</Label>
                  <Input 
                    placeholder="Enter a catchy title..." 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SEO Short Description</Label>
                  <Input 
                    placeholder="Brief summary for search engines..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preview Image URL</Label>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={formData.status === "draft" ? "default" : "outline"} 
                      onClick={() => setFormData({ ...formData, status: "draft" })}
                      className="flex-1"
                    >
                      Draft
                    </Button>
                    <Button 
                      variant={formData.status === "published" ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, status: "published" })}
                      className="flex-1"
                    >
                      Published
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content (Rich Text)</Label>
              <TipTapEditor 
                content={formData.content} 
                onChange={(html) => setFormData({ ...formData, content: html })} 
              />
            </div>

            {/* Resource Links Section */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-semibold">Resource Links</Label>
                  <p className="text-sm text-muted-foreground">Add clickable links for files, references, or external sites.</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData({
                    ...formData,
                    resources: [...formData.resources, { name: "", url: "" }]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="grid gap-4">
                {formData.resources.map((res, index) => (
                  <div key={index} className="flex gap-4 items-end bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex-1 space-y-2">
                      <Label>Link Name</Label>
                      <Input 
                        placeholder="e.g. Download PDF" 
                        value={res.name}
                        onChange={(e) => {
                          const newResources = [...formData.resources];
                          newResources[index].name = e.target.value;
                          setFormData({ ...formData, resources: newResources });
                        }}
                      />
                    </div>
                    <div className="flex-[2] space-y-2">
                      <Label>URL</Label>
                      <Input 
                        placeholder="https://..." 
                        value={res.url}
                        onChange={(e) => {
                          const newResources = [...formData.resources];
                          newResources[index].url = e.target.value;
                          setFormData({ ...formData, resources: newResources });
                        }}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        const newResources = formData.resources.filter((_, i) => i !== index);
                        setFormData({ ...formData, resources: newResources });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ModerationTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<any[]>({
    queryKey: ["/api/comments"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Comment Deleted", description: "The comment has been removed." });
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Moderation</h3>
          <p className="text-sm text-muted-foreground">Review and manage articles comments from your visitors.</p>
        </div>
      </div>

      {!comments || comments.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No visitor comments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-full flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {comment.author}
                      <Badge variant="outline" className="text-[10px] uppercase font-normal">
                        Visitor
                      </Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Left on {format(new Date(comment.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Delete this comment permanently?")) {
                        deleteMutation.mutate(comment._id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg italic text-foreground/80">
                  "{comment.content}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
