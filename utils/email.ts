import env from "dotenv";
env.config();
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { google } from "googleapis";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

//Creating of email
export const CreateAdminEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_MAIL as string,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES as string,
  });

  const URL_value = `http://localhost:5173/authauthauthauthauthauthauth/login/${token}`;

  let pathFile = path.join(__dirname, "../view/CreateEmail.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
    url: URL_value,
  });

  const mailer = {
    to: user?.email,
    from: `Account Verificaion <${process.env.GOOGLE_MAIL as string}>`,
    subject: "Account Creation",
    html,
  };
  await Transporter.sendMail(mailer).then(() => {
    console.clear();
    console.log("Email Sent📧");
  });
};

//Reseting of email
export const ForgetAdminEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAUTH2",
      user: process.env.GOOGLE_MAIL as string,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES as string,
  });

  const URL_value = `http://localhost:5173/authauthauthauthauthauthauth/reset/${token}`;

  let pathFile = path.join(__dirname, "../view/ForgetEmail.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
    url: URL_value,
  });

  const mailer = {
    to: user?.email,
    from: `Forget Password <${process.env.GOOGLE_MAIL as string}>`,
    subject: "Account Reset",
    html,
  };
  await Transporter.sendMail(mailer).then(() => {
    console.clear();
    console.log("Email Sent📧");
  });
};
