import { Router } from "express";
import {
  emailVerify,
  forgotPassword,
  refreshToken,
  registerUser,
  resetPassword,
  uploadAvater,
  userDetails,
  userDetailsUpdate,
  UserLogin,
  userLogout,
  verifyForgotPassword,
} from "../controllers/user.controller.js";
import { authProtect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", emailVerify);
userRouter.post("/login", UserLogin);
userRouter.post("/logout", authProtect, userLogout);
userRouter.put(
  "/upload-avater",
  authProtect,
  upload.single("avater"),
  uploadAvater
);

userRouter.put("/update", authProtect, userDetailsUpdate);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp", verifyForgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", authProtect, userDetails);

export default userRouter;
