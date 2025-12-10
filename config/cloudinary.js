import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // must exist
  api_key: process.env.CLOUDINARY_API_KEY,       // must exist
  api_secret: process.env.CLOUDINARY_API_SECRET, // must exist
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const upload = multer({ storage });
