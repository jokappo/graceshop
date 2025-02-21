import { Router } from "express";
import { AddSubCategoryController } from "../controllers/subCategory.controller.js";
import auth from "../middleware/auth.js";

const SubCategoryRouter = Router()

SubCategoryRouter.post('/create', auth, AddSubCategoryController)

export default SubCategoryRouter