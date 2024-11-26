import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerUserController,
  resetPassword,
  updateUserController,
  uploadAvatarController,
  verifyEmailController,
  verifyForgotPasswordOtpController,
} from "../controllers/user.controllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router(); // connection de l'utilisateur

userRouter.post("/register", registerUserController),
userRouter.post("/verify_email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put("/upload-avatar",auth,upload.single("avatar"),uploadAvatarController);
userRouter.put("/upload-user", auth, updateUserController);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp",verifyForgotPasswordOtpController);
userRouter.put("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshTokenController);

export default userRouter;
