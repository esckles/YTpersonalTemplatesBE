"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const postController_1 = require("../controller/postController");
const likeController_1 = require("../controller/likeController");
const followController_1 = require("../controller/followController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = (0, express_1.Router)();
//
// 💻 Admin Routes
//
router.route("/register").post(multer_1.default.single("avatar"), adminController_1.RegisterAdmin);
router.route("/verify/:userID").post(adminController_1.VerifyAdmin);
router.route("/login").post(adminController_1.LoginAdmin);
router.route("/readone/:userID").get(adminController_1.ReadoneAdmin);
router.route("/readall").get(adminController_1.ReadallAdmin);
router.route("/forget").patch(adminController_1.ForgetAdmin);
router.route("/reset/:userID").patch(adminController_1.ResetAdmin);
//
// 📝 Post Routes
//
router.route("/createpost").post(multer_1.default.single("image"), postController_1.CreateUserPost);
router.route("/createpost").post(multer_1.default.single("image"), postController_1.CreateUserPost);
// Optional: still protect update/delete routes
router
    .route("/updatepost/:postID")
    .patch(multer_1.default.single("image"), postController_1.UpdateUserPost);
router.route("/readallposts").get(postController_1.ReadAllUserPost);
router.route("/readonepost/:postID").get(postController_1.ReadOneUserPost);
router.route("/deletepost/:postID").delete(postController_1.DeleteOnePost);
router.get("/readmainpost/:adminID", postController_1.ReadMainFeed);
router.route("/searchpost").post(postController_1.searchPost);
//
// 🤝 Follow / Like Routes
//
router.route("/follow/:adminToFollowID").patch(followController_1.FollowAdmin);
router.route("/like-post/:postID").patch(likeController_1.LikePost);
router.patch("/post/unlock/:postID", postController_1.toggleDownloadable);
exports.default = router;
