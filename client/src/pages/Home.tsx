import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"], a[href^="/#"]');

      if (link) {
        const href = link.getAttribute("href");
        if (href) {
          e.preventDefault();
          const targetId = href.startsWith("/#") ? href.substring(2) : href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const navHeight = 80;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          }
        }
      }
    };

    // Handle hash on initial load
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          const navHeight = 80;
          const targetPosition = targetElement.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
