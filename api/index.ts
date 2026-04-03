import { app, appPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  // Ensure the server (DB + Routes) is fully initialized before handling the request
  await appPromise;
  
  // Use the standard Express app handle to process the request
  return app(req, res);
}
