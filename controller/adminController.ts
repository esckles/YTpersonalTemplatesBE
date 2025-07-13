import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "dotenv";
import { Request, Response } from "express";
import adminModel from "../model/adminModel";
import { CreateAdminEmail, ForgetAdminEmail } from "../utils/email";
import path from "path";
import cloudinary from "../utils/cloudinary";
import { removeFileUpload } from "../utils/removeFileUpload";

env.config();

export const RegisterAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const folderPath = path.join(__dirname, "../uploads");
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");

    if (!req.file) {
      return res.status(400).json({ message: "File is Required", status: 400 });
    }
    const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      req.file.path
    );

    const user = await adminModel.create({
      name,
      email,
      password: hashed,
      avatar: secure_url,
      avatarID: public_id,
      isVerifiedToken: token,
    });
    removeFileUpload(folderPath);
    CreateAdminEmail(user);
    return res
      .status(201)
      .json({ message: "Registered successfully", status: 201, data: user });
  } catch (error: any) {
    console.log("Registration Error:", error.message); // 👈 this helps you know what's wrong
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

export const VerifyAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await adminModel.findById(userID);

    if (user) {
      await adminModel.findByIdAndUpdate(
        user?._id,
        {
          isVerified: true,
          isVerifiedToken: "",
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "admin verified successfully", status: 201 });
    } else {
      return res.status(404).json({ message: "Error Verifying", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error Verification", status: 404 });
  }
};

export const LoginAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await adminModel.findOne({ email });

    if (user) {
      const descryptPassword = await bcrypt.compare(password, user?.password);
      if (descryptPassword) {
        if (user?.isVerified && user?.isVerifiedToken === "") {
          const token = jwt.sign(
            {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "2d" }
          );
          return res
            .status(201)
            .json({ message: "Welcome Back", status: 201, data: token });
        } else {
          return res
            .status(404)
            .json({ message: "Admin not verified", status: 404 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Incorrect password", status: 404 });
      }
    } else {
      return res
        .status(404)
        .json({ message: "email does not exist go register!", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error Login", status: 404 });
  }
};

export const ReadoneAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await adminModel.findById(userID);
    return res
      .status(200)
      .json({ message: "One admin found", status: 200, data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error fecthing one admin", status: 404 });
  }
};

export const ReadallAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await adminModel.find();

    return res
      .status(200)
      .json({ message: "All admin found", status: 200, data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error fetch all admin", status: 404 });
  }
};

export const ForgetAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(6).toString("hex");
    const user = await adminModel.findOne({ email });

    if (user) {
      await adminModel.findByIdAndUpdate(
        user?._id,
        {
          isVerifiedToken: token,
        },
        { new: true }
      );
      ForgetAdminEmail(user);
      return res.status(200).json({
        message: "an email as been sent to you for reset password",
        status: 200,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Error wtih forget password", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error", status: 404 });
  }
};

export const ResetAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (userID) {
      await adminModel.findByIdAndUpdate(
        userID,
        {
          isVerifiedToken: "",
          password: hashed,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "password changed successfully", status: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "Error with reset password", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error reseting", status: 404 });
  }
};
