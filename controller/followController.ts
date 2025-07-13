import { Request, Response } from "express";
import adminModel from "../model/adminModel";

export const FollowAdmin = async (req: Request, res: Response) => {
  try {
    const { adminToFollowID } = req.params;
    const { anonID } = req.body;

    // Validate inputs
    if (!anonID || typeof anonID !== "string") {
      return res.status(400).json({ message: "Invalid or missing anonID" });
    }

    const admin = await adminModel.findById(adminToFollowID);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // check if anonID already exists
    if (admin.followers.includes(anonID)) {
      return res.status(200).json({
        message: "Already following this admin.",
        totalFollowers: admin.followers.length,
        alreadyFollowing: true,
      });
    }

    admin.followers.push(anonID);
    await admin.save();

    return res.status(200).json({
      message: "Thanks for following!",
      totalFollowers: admin.followers.length,
      alreadyFollowing: false,
    });
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: "Server error while following." });
  }
};
