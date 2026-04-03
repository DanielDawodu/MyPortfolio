import { app, appPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  try {
    // 🛡️ Ensure the server (DB + Routes) is fully initialized before handling the request
    await appPromise;
    
    // 🚀 Use the standard Express app handle to process the request
    return app(req, res);
  } catch (err: any) {
    console.error("❌ Vercel Function Invocation Error:", err);
    
    // Return an actionable JSON message even if the DB connection fails
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Server Initialization Failed", 
        error: err.message || "Unknown error during initialization",
        tip: "Please check your Vercel Environment Variables (MONGODB_URI, etc.)"
      });
    }
  }
}
