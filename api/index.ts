import { app, appPromise } from "./lib/app";

export default async function handler(req: any, res: any) {
  try {
    // 🛡️ Ensure the server (DB + Routes) is fully initialized before handling the request
    // By importing from app.ts, we avoid loading Vite/Dev dependencies on Vercel
    await appPromise;
    
    // 🚀 Use the standard Express app handle to process the request
    return app(req, res);
  } catch (err: any) {
    console.error("❌ Vercel Function Invocation Error:", err);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Server Initialization Failed", 
        error: err.message || "Unknown error during initialization",
        tip: "Please check your Vercel Environment Variables (MONGODB_URI, etc.)"
      });
    }
  }
}
