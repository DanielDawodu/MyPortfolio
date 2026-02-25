import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Name */}
          <a
            href="/#hero"
            data-testid="link-home"
            className="text-xl md:text-2xl font-bold text-foreground hover-elevate px-2 py-1 rounded-md transition-colors"
          >
            Daniel Dawodu
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    data-testid={`link-${link.name.toLowerCase()}`}
                    className="text-base font-medium text-foreground/80 hover:text-foreground relative group transition-colors"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <Button
              data-testid="button-cta"
              className="font-medium"
              size="default"
              asChild
            >
              <a href="/#contact">Get in Touch</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="button-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover-elevate rounded-md"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          data-testid="mobile-menu"
          className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-40"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <ul className="flex flex-col items-center gap-6 w-full">
              {navLinks.map((link) => (
                <li key={link.name} className="w-full">
                  <a
                    href={link.href}
                    data-testid={`mobile-link-${link.name.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-2xl font-semibold text-foreground hover:text-primary transition-colors py-3"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              data-testid="button-mobile-cta"
              size="lg"
              className="font-medium w-full max-w-xs"
              asChild
              onClick={() => setIsMenuOpen(false)}
            >
              <a href="/#contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
