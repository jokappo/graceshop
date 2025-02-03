import { Router } from "express";
import auth from "../middleware/auth.js";
import uploadImageController from "../controllers/uploadImage.controller.js";

const uploadRouter = Router()

uploadRouter.post('/upload', auth, uploadImageController)

export default uploadRouter