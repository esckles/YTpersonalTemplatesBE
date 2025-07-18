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
exports.ForgetAdminEmail = exports.CreateAdminEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const googleapis_1 = require("googleapis");
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });
//Creating of email
const CreateAdminEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (yield oAuth.getAccessToken()).token;
    const Transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_MAIL,
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            refreshToken: GOOGLE_TOKEN,
            accessToken: accessToken,
        },
    });
    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    const URL_value = `http://localhost:5173/authauthauthauthauthauthauth/login/${token}`;
    let pathFile = path_1.default.join(__dirname, "../view/CreateEmail.ejs");
    const html = yield ejs_1.default.renderFile(pathFile, {
        name: user === null || user === void 0 ? void 0 : user.name,
        url: URL_value,
    });
    const mailer = {
        to: user === null || user === void 0 ? void 0 : user.email,
        from: `Account Verificaion <${process.env.GOOGLE_MAIL}>`,
        subject: "Account Creation",
        html,
    };
    yield Transporter.sendMail(mailer).then(() => {
        console.clear();
        console.log("Email Sent📧");
    });
});
exports.CreateAdminEmail = CreateAdminEmail;
//Reseting of email
const ForgetAdminEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (yield oAuth.getAccessToken()).token;
    const Transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAUTH2",
            user: process.env.GOOGLE_MAIL,
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            refreshToken: GOOGLE_TOKEN,
            accessToken: accessToken,
        },
    });
    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    const URL_value = `http://localhost:5173/authauthauthauthauthauthauth/reset/${token}`;
    let pathFile = path_1.default.join(__dirname, "../view/ForgetEmail.ejs");
    const html = yield ejs_1.default.renderFile(pathFile, {
        name: user === null || user === void 0 ? void 0 : user.name,
        url: URL_value,
    });
    const mailer = {
        to: user === null || user === void 0 ? void 0 : user.email,
        from: `Forget Password <${process.env.GOOGLE_MAIL}>`,
        subject: "Account Reset",
        html,
    };
    yield Transporter.sendMail(mailer).then(() => {
        console.clear();
        console.log("Email Sent📧");
    });
});
exports.ForgetAdminEmail = ForgetAdminEmail;
