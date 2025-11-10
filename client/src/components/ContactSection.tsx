import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            data-testid="text-contact-title"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground"
          >
            Get In Touch
          </h2>
          <p
            data-testid="text-contact-subtitle"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Have a project in mind or want to collaborate? I'd love to hear from
            you.
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-7">
            <form
              data-testid="form-contact"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="name" className="text-base font-medium mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  data-testid="input-name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-testid="input-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-base font-medium mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  data-testid="input-message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button
                type="submit"
                data-testid="button-submit"
                size="lg"
                className="w-full font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div
                  data-testid="contact-email"
                  className="flex items-start gap-3"
                >
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <a
                      href="mailto:hello@example.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      hello@example.com
                    </a>
                  </div>
                </div>
                <div
                  data-testid="contact-location"
                  className="flex items-start gap-3"
                >
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div className="text-muted-foreground">
                      San Francisco, CA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span
                  data-testid="text-availability"
                  className="font-semibold text-foreground"
                >
                  Available for New Projects
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting freelance and contract opportunities.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Connect With Me
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    data-testid={`link-social-${social.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-md bg-card border border-card-border hover-elevate transition-all"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
