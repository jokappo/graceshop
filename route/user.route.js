import { Router } from "express";
import { loginController, logoutController, registerUserController, verifyEmailController } from "../controllers/user.controllers.js";
import auth from "../middleware/auth.js";

const userRouter = Router()  // connection de l'utilisateur

userRouter.post('/register',registerUserController),
userRouter.post('/verify_email',verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)



export default userRouter;