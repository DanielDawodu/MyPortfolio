// Bot detection regex
const BOT_AGENTS = /Twitterbot|facebookexternalhit|WhatsApp|LinkedInBot|googlebot|bingbot|slackbot|discordbot/i;

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Only intercept bot requests for article details
  if (BOT_AGENTS.test(userAgent) && url.pathname.startsWith('/articles/')) {
    const slug = url.pathname.split('/').pop();
    if (!slug || slug === 'articles') return;

    try {
      // 1. Fetch article data from API
      // We use the origin from the request to stay internal
      const apiBase = url.origin;
      const apiResponse = await fetch(`${apiBase}/api/articles/${slug}`);
      
      if (!apiResponse.ok) return;
      const article = await apiResponse.json();

      // 2. Fetch the base index.html
      const htmlResponse = await fetch(`${apiBase}/index.html`);
      if (!htmlResponse.ok) return;
      let html = await htmlResponse.text();

      // 3. Inject meta tags
      const siteName = "Daniel Dawodu | Professional Web Developer";
      const fullTitle = `${article.title} | ${siteName}`;
      const description = article.description || "";
      const imageUrl = article.imageUrl || `${apiBase}/og-image.png`;
      const canonicalUrl = request.url;

      const metaTags = `
        <title>${fullTitle}</title>
        <meta name="description" content="${description}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:title" content="${fullTitle}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="${canonicalUrl}" />
        <meta name="twitter:title" content="${fullTitle}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;

      // Replace existing title and inject meta tags before </head>
      // This is a simple regex replacement. More robust would be needed for complex HTML.
      html = html.replace(/<title>.*?<\/title>/, metaTags);
      
      // If no title found, just append to head
      if (html.indexOf(metaTags) === -1) {
        html = html.replace('</head>', `${metaTags}\n</head>`);
      }

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      console.error('Middleware SEO Injection Error:', error);
      return;
    }
  }

  // Regular users just proceed
  return;
}

// Config to only match article routes
export const config = {
  matcher: '/articles/:slug*',
};
