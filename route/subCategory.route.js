import { Router } from "express";
import { AddSubCategoryController, GetSubCategoryController, UpdateSubCategoryController } from "../controllers/subCategory.controller.js";
import auth from "../middleware/auth.js";

const SubCategoryRouter = Router()

SubCategoryRouter.post('/create', auth, AddSubCategoryController)
SubCategoryRouter.get('/get', GetSubCategoryController)
SubCategoryRouter.put('/update', auth, UpdateSubCategoryController)

export default SubCategoryRouter