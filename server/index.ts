import { app, appPromise } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

(async () => {
  const { server } = await appPromise;

  // 🛡️ Safe Environment Check for Vercel vs Local
  const isVercel = !!process.env.VERCEL;
  const isDev = app.get("env") === "development" && !isVercel;

  if (isDev) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  
  // 🚀 Only listen if run directly (not in Vercel)
  if (!isVercel) {
    server.listen(
      {
        port,
        host: "0.0.0.0",
      },
      () => {
        log(`serving on http://localhost:${port}`);
      }
    );
  }
})();

export default app;
export { app, appPromise };
