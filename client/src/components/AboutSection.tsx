import { Badge } from "@/components/ui/badge";
import { Code2, Database, Globe, Palette, Server, Smartphone } from "lucide-react";

export default function AboutSection() {
  const skills = [
    { name: "React & TypeScript", icon: Code2 },
    { name: "Node.js & Express", icon: Server },
    { name: "PostgreSQL & MongoDB", icon: Database },
    { name: "Tailwind CSS", icon: Palette },
    { name: "REST APIs", icon: Globe },
    { name: "Responsive Design", icon: Smartphone },
  ];

  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl border-2 border-border bg-card flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Code2 className="w-16 h-16 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Professional Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <h2
              data-testid="text-about-title"
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-foreground"
            >
              About Me
            </h2>
            <div className="space-y-4 text-base md:text-lg text-foreground/80 mb-8">
              <p data-testid="text-about-bio-1">
                I'm a passionate full-stack developer with a keen eye for detail
                and a love for creating seamless digital experiences. With over 5
                years of experience, I specialize in building modern web
                applications that are both beautiful and functional.
              </p>
              <p data-testid="text-about-bio-2">
                My approach combines clean code practices with user-centered
                design principles. I believe in writing maintainable code that
                scales and creating interfaces that users love to interact with.
              </p>
              <p data-testid="text-about-bio-3">
                When I'm not coding, you'll find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community.
              </p>
            </div>

            {/* Skills Grid */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-foreground">
                Core Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    data-testid={`skill-${index}`}
                    className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border hover-elevate"
                  >
                    <skill.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-card-foreground">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
