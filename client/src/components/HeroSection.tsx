import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_background_workspace_image_f92f52a2.png";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Workspace background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 text-white">
            <h1
              data-testid="text-hero-title"
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Building Digital
              <br />
              Experiences
            </h1>
            <p
              data-testid="text-hero-subtitle"
              className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed"
            >
              Full-stack developer crafting modern web applications with clean
              code and exceptional user experiences.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="button-view-projects"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium backdrop-blur-md border border-primary-border"
                asChild
              >
                <a href="#projects">
                  View Projects
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                data-testid="button-contact"
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-medium"
                asChild
              >
                <a href="#contact">
                  Contact Me
                  <Download className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Stats/Info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              data-testid="card-stat-experience"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="text-4xl font-bold text-white mb-2">5+ Years</div>
              <div className="text-white/80">Professional Experience</div>
            </div>
            <div
              data-testid="card-stat-projects"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="text-4xl font-bold text-white mb-2">50+ Projects</div>
              <div className="text-white/80">Successfully Delivered</div>
            </div>
            <div
              data-testid="card-stat-clients"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            data-testid="scroll-indicator"
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
