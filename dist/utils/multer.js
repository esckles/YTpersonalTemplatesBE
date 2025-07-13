"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils/multer.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload folder exists
const folder = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(folder)) {
    fs_1.default.mkdirSync(folder); // 👈 use mkdirSync, not mkdir with callback
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, folder);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
// 👇 EXPORT THE multer() INSTANCE, NOT THE OBJECT
const upload = (0, multer_1.default)({ storage });
exports.default = upload; // 👈 IMPORTANT: default export
