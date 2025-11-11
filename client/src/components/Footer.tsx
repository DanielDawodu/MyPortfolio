import { ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-card border-t border-card-border py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left - Name/Tagline */}
          <div>
            <h3
              data-testid="text-footer-name"
              className="text-lg font-bold text-card-foreground mb-1"
            >
              Daniel Dawodu
            </h3>
            <p className="text-sm text-muted-foreground">
              Crafting digital experiences
            </p>
          </div>

          {/* Center - Quick Links */}
          <div className="flex justify-center">
            <ul className="flex gap-6">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    data-testid={`link-footer-${link.name.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Back to Top */}
          <div className="flex justify-end">
            <a
              href="#hero"
              data-testid="button-back-to-top"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              Back to top
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-card-border text-center">
          <p
            data-testid="text-copyright"
            className="text-sm text-muted-foreground"
          >
            © {currentYear} Daniel Dawodu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
