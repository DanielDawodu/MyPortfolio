import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const baseLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Articles", href: "/articles" },
    { name: "Contact", href: "/#contact" },
  ];

  const navLinks = user 
    ? [...baseLinks, { name: "Dashboard", href: "/admin" }] 
    : baseLinks;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Name */}
          <Link href="/">
            <a
              className="text-xl md:text-2xl font-bold text-foreground hover-elevate px-2 py-1 rounded-md transition-colors"
            >
              Daniel Dawodu
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      data-testid={`link-${link.name.toLowerCase()}`}
                      className="text-base font-medium text-foreground/80 hover:text-foreground relative group transition-colors"
                    >
                      {link.name}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      data-testid={`link-${link.name.toLowerCase()}`}
                      className="text-base font-medium text-foreground/80 hover:text-foreground relative group transition-colors"
                    >
                      {link.name}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}
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

          {/* Mobile Menu Button - Z-INDEX MUST BE ABOVE MENU */}
          <button
            data-testid="button-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover-elevate rounded-md relative z-[110]"
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 bg-background z-[100] flex flex-col pt-20 px-6 overflow-y-auto"
          >
            <ul className="flex flex-col gap-6 w-full">
              {navLinks.map((link) => (
                <li key={link.name} className="w-full">
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      data-testid={`mobile-link-${link.name.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-3xl font-bold text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      data-testid={`mobile-link-${link.name.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-3xl font-bold text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-col gap-6">
              <Button
                data-testid="button-mobile-cta"
                size="lg"
                className="font-semibold text-xl h-14 rounded-2xl w-full"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <a href="/#contact">Get in Touch</a>
              </Button>
              <p className="text-center text-muted-foreground text-sm">
                Built with precision by Daniel Dawodu
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
