import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, registerUserController, updateUserController, uploadAvatarController, verifyEmailController } from "../controllers/user.controllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router()  // connection de l'utilisateur

userRouter.post('/register',registerUserController),
userRouter.post('/verify_email',verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatarController)
userRouter.put('/upload-user', auth, updateUserController)
userRouter.put('/forgot-password', forgotPasswordController)




export default userRouter;