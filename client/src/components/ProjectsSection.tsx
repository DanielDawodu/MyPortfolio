import { Link } from "wouter";
import { projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            data-testid="text-projects-title"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground"
          >
            Featured Projects
          </h2>
          <p
            data-testid="text-projects-subtitle"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A selection of projects that showcase my skills and passion for
            building great products.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((project) => (
            <div
              key={project.id}
              data-testid={`project-card-${project.id}`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover-elevate transition-all duration-300"
            >
              {/* Project Image/Preview */}
              <div
                className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}
              >
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

              {/* Project Content */}
              <div className="p-6">
                <h3
                  data-testid={`text-project-title-${project.id}`}
                  className="text-xl md:text-2xl font-semibold mb-3 text-card-foreground"
                >
                  {project.title}
                </h3>
                <p
                  data-testid={`text-project-description-${project.id}`}
                  className="text-muted-foreground mb-4 leading-relaxed"
                >
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={tag}
                      data-testid={`badge-tech-${project.id}-${index}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    data-testid={`button-view-demo-${project.id}`}
                    variant="default"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </a>
                  </Button>
                  <Button
                    data-testid={`button-view-code-${project.id}`}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
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

        {/* More Projects Button */}
        <div className="mt-16 text-center">
          <Button size="lg" className="px-8" asChild>
            <Link href="/projects">More Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

