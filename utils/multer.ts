// utils/multer.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const folder = path.join(__dirname, "../uploads");
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder); // 👈 use mkdirSync, not mkdir with callback
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// 👇 EXPORT THE multer() INSTANCE, NOT THE OBJECT
const upload = multer({ storage });

export default upload; // 👈 IMPORTANT: default export
