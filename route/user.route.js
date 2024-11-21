import { Router } from "express";
import { registerUserController } from "../controllers/user.controllers.js";

const userRouter = Router()  // connection de l'utilisateur

userRouter.post('/register',registerUserController)


export default userRouter;