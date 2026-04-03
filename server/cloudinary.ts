import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configuration
console.log("☁️ Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file type
    let folder = "portfolio/others";
    if (file.mimetype.startsWith("image/")) folder = "portfolio/images";
    else if (file.mimetype.startsWith("video/")) folder = "portfolio/videos";
    else if (file.mimetype === "application/pdf") folder = "portfolio/documents";

    return {
      folder: folder,
      resource_type: "auto", // Automatically detect (image, video, or raw)
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export const upload = multer({ storage: storage });
export { cloudinary };
