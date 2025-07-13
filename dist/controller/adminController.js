"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetAdmin = exports.ForgetAdmin = exports.ReadallAdmin = exports.ReadoneAdmin = exports.LoginAdmin = exports.VerifyAdmin = exports.RegisterAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const email_1 = require("../utils/email");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const removeFileUpload_1 = require("../utils/removeFileUpload");
dotenv_1.default.config();
const RegisterAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderPath = path_1.default.join(__dirname, "../uploads");
        const { name, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        if (!req.file) {
            return res.status(400).json({ message: "File is Required", status: 400 });
        }
        const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
        const user = yield adminModel_1.default.create({
            name,
            email,
            password: hashed,
            avatar: secure_url,
            avatarID: public_id,
            isVerifiedToken: token,
        });
        (0, removeFileUpload_1.removeFileUpload)(folderPath);
        (0, email_1.CreateAdminEmail)(user);
        return res
            .status(201)
            .json({ message: "Registered successfully", status: 201, data: user });
    }
    catch (error) {
        console.log("Registration Error:", error.message); // 👈 this helps you know what's wrong
        return res.status(500).json({ message: error.message, status: 500 });
    }
});
exports.RegisterAdmin = RegisterAdmin;
const VerifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield adminModel_1.default.findById(userID);
        if (user) {
            yield adminModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                isVerified: true,
                isVerifiedToken: "",
            }, { new: true });
            return res
                .status(201)
                .json({ message: "admin verified successfully", status: 201 });
        }
        else {
            return res.status(404).json({ message: "Error Verifying", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error Verification", status: 404 });
    }
});
exports.VerifyAdmin = VerifyAdmin;
const LoginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield adminModel_1.default.findOne({ email });
        if (user) {
            const descryptPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (descryptPassword) {
                if ((user === null || user === void 0 ? void 0 : user.isVerified) && (user === null || user === void 0 ? void 0 : user.isVerifiedToken) === "") {
                    const token = jsonwebtoken_1.default.sign({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    }, process.env.JWT_SECRET, { expiresIn: "2d" });
                    return res
                        .status(201)
                        .json({ message: "Welcome Back", status: 201, data: token });
                }
                else {
                    return res
                        .status(404)
                        .json({ message: "Admin not verified", status: 404 });
                }
            }
            else {
                return res
                    .status(404)
                    .json({ message: "Incorrect password", status: 404 });
            }
        }
        else {
            return res
                .status(404)
                .json({ message: "email does not exist go register!", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error Login", status: 404 });
    }
});
exports.LoginAdmin = LoginAdmin;
const ReadoneAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield adminModel_1.default.findById(userID);
        return res
            .status(200)
            .json({ message: "One admin found", status: 200, data: user });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error fecthing one admin", status: 404 });
    }
});
exports.ReadoneAdmin = ReadoneAdmin;
const ReadallAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield adminModel_1.default.find();
        return res
            .status(200)
            .json({ message: "All admin found", status: 200, data: user });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error fetch all admin", status: 404 });
    }
});
exports.ReadallAdmin = ReadallAdmin;
const ForgetAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const token = crypto_1.default.randomBytes(6).toString("hex");
        const user = yield adminModel_1.default.findOne({ email });
        if (user) {
            yield adminModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                isVerifiedToken: token,
            }, { new: true });
            (0, email_1.ForgetAdminEmail)(user);
            return res.status(200).json({
                message: "an email as been sent to you for reset password",
                status: 200,
            });
        }
        else {
            return res
                .status(404)
                .json({ message: "Error wtih forget password", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error", status: 404 });
    }
});
exports.ForgetAdmin = ForgetAdmin;
const ResetAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        if (userID) {
            yield adminModel_1.default.findByIdAndUpdate(userID, {
                isVerifiedToken: "",
                password: hashed,
            }, { new: true });
            return res
                .status(200)
                .json({ message: "password changed successfully", status: 200 });
        }
        else {
            return res
                .status(404)
                .json({ message: "Error with reset password", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error reseting", status: 404 });
    }
});
exports.ResetAdmin = ResetAdmin;
