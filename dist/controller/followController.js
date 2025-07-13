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
exports.FollowAdmin = void 0;
const adminModel_1 = __importDefault(require("../model/adminModel"));
const FollowAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminToFollowID } = req.params;
        const { anonID } = req.body;
        // Validate inputs
        if (!anonID || typeof anonID !== "string") {
            return res.status(400).json({ message: "Invalid or missing anonID" });
        }
        const admin = yield adminModel_1.default.findById(adminToFollowID);
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
        yield admin.save();
        return res.status(200).json({
            message: "Thanks for following!",
            totalFollowers: admin.followers.length,
            alreadyFollowing: false,
        });
    }
    catch (error) {
        console.error("Follow error:", error);
        return res.status(500).json({ message: "Server error while following." });
    }
});
exports.FollowAdmin = FollowAdmin;
