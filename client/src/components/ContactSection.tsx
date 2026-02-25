import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "emailjs-com";

export default function ContactSection() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_67kkejz",    // Replace with your EmailJS Service ID
        "template_90l2sl2",   // Replace with your Contact Us Template ID
        formRef.current,
        "a8_isc7VmymEbRThF"     // Replace with your EmailJS Public Key
      );

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error Sending Message",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com/DanielDawodu" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/daniel-dawodu-13b937337/",
    },
    { name: "Twitter", icon: Twitter, url: "https://x.com/danieldawodu95" },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
            Get In Touch
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from
            you.
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Hidden inputs for template parameters not in the form */}
              <input type="hidden" name="title" value="New Contact Form Submission" />
              <input
                type="hidden"
                name="time"
                value={new Date().toLocaleString()}
              />

              <div>
                <Label htmlFor="name" className="text-base font-medium mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"  // matches template {{name}}
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
                  name="email"  // matches template {{email}}
                  type="email"
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
                  name="message"  // matches template {{message}}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button
                type="submit"
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
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <a
                      href="mailto:danieldawodu07@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      danieldawodu07@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div className="text-muted-foreground">
                      UNILAG, Lagos, Nigeria
                    </div>
                  </div>
                </div>
              </div>
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
