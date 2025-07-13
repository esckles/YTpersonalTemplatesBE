"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminModel = new mongoose_1.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    avatarID: {
        type: String,
    },
    posts: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Posts",
        },
    ],
    isVerified: {
        type: Boolean,
    },
    isVerifiedToken: {
        type: String,
    },
    followers: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("AdminRegisteration", adminModel);
