import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// Create uploads folder automatically
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });

  console.log("✅ Upload folder created:", uploadDir);
} else {
  console.log("✅ Upload folder exists:", uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📂 Upload destination:", uploadDir);

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const fileName =
      Date.now() + path.extname(file.originalname);

    console.log("🖼 Original File:", file.originalname);
    console.log("🖼 Saved As:", fileName);

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("📥 File Received:");
  console.log("Name:", file.originalname);
  console.log("Type:", file.mimetype);

  if (file.mimetype.startsWith("image/")) {
    console.log("✅ Image Accepted");

    cb(null, true);
  } else {
    console.log("❌ Rejected: Not an image");

    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;