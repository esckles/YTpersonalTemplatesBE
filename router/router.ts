import { Router } from "express";
import {
  ForgetAdmin,
  LoginAdmin,
  ReadallAdmin,
  ReadoneAdmin,
  RegisterAdmin,
  ResetAdmin,
  VerifyAdmin,
} from "../controller/adminController";
import {
  CreateUserPost,
  ReadAllUserPost,
  ReadOneUserPost,
  DeleteOnePost,
  searchPost,
  UpdateUserPost,
  ReadMainFeed,
  toggleDownloadable,
} from "../controller/postController";
import { LikePost } from "../controller/likeController";
import { FollowAdmin } from "../controller/followController";
import { verifyToken } from "../controller/authMiddleware";
import upload from "../utils/multer";

const router: any = Router();

//
// 💻 Admin Routes
//
router.route("/register").post(upload.single("avatar"), RegisterAdmin);
router.route("/verify/:userID").post(VerifyAdmin);
router.route("/login").post(LoginAdmin);
router.route("/readone/:userID").get(ReadoneAdmin);
router.route("/readall").get(ReadallAdmin);
router.route("/forget").patch(ForgetAdmin);
router.route("/reset/:userID").patch(ResetAdmin);

//
// 📝 Post Routes
//
router.route("/createpost").post(upload.single("image"), CreateUserPost);

router.route("/createpost").post(upload.single("image"), CreateUserPost);

// Optional: still protect update/delete routes
router
  .route("/updatepost/:postID")
  .patch(upload.single("image"), UpdateUserPost);

router.route("/readallposts").get(ReadAllUserPost);
router.route("/readonepost/:postID").get(ReadOneUserPost);
router.route("/deletepost/:postID").delete(DeleteOnePost);
router.get("/readmainpost/:adminID", ReadMainFeed);
router.route("/searchpost").post(searchPost);

//
// 🤝 Follow / Like Routes
//
router.route("/follow/:adminToFollowID").patch(FollowAdmin);
router.route("/like-post/:postID").patch(LikePost);

router.patch("/post/unlock/:postID", toggleDownloadable);

export default router;
