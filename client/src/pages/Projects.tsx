import { Link } from "wouter";
import { projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Projects() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="py-16 md:py-24 lg:py-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                            All Projects
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            A complete list of my work, experiments, and ongoing projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group rounded-xl border border-border bg-card overflow-hidden hover-elevate transition-all duration-300"
                            >
                                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="relative z-10 text-center p-6">
                                            <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-background/50 backdrop-blur-sm flex items-center justify-center border border-border">
                                                <Github className="w-10 h-10 text-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-card-foreground">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="default" size="sm" className="flex-1" asChild>
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View Demo
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="w-4 h-4 mr-2" />
                                                View Code
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
