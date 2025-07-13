"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postModel = new mongoose_1.Schema({
    title: {
        type: String,
    },
    postImage: {
        type: String,
    },
    postImageID: {
        type: String,
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    likes: [
        {
            type: String,
        },
    ],
    downloadable: {
        type: Boolean,
        default: false, // locked by default
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Posts", postModel);
