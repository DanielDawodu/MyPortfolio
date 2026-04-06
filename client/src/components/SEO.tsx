import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  authorName?: string;
  publishedAt?: string;
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  authorName = "Daniel Dawodu",
  publishedAt
}: SEOProps) {
  const siteName = "Daniel Dawodu | Professional Web Developer";
  const fullTitle = title === "Home" ? siteName : `${title} | ${siteName}`;
  const seoImage = image || "/og-image.png"; // Use article image or fallback

  // JSON-LD Structured Data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Daniel Dawodu",
    "url": "https://danieldawodu.vercel.app",
    "image": "/profile.jpg",
    "jobTitle": "Full-stack Developer",
    "sameAs": [
      "https://github.com/DanielDawodu",
      "https://linkedin.com/in/daniel-dawodu-13b937337",
      "https://x.com/danieldawodu95"
    ]
  };

  const blogPostSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": seoImage,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "datePublished": publishedAt,
    "url": url
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoImage} />
      
      {/* LinkedIn / Professional Attribution */}
      <meta property="article:author" content="https://linkedin.com/in/daniel-dawodu-13b937337" />
      <meta property="article:publisher" content="https://linkedin.com/in/daniel-dawodu-13b937337" />
      <meta name="author" content="Daniel Dawodu" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      {blogPostSchema && (
        <script type="application/ld+json">
          {JSON.stringify(blogPostSchema)}
        </script>
      )}
    </Helmet>
  );
}
