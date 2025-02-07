import { Router } from "express";
import { AddCategoryController, getCategoryController } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const categoryRouter = Router()

categoryRouter.post("/add-category", auth,AddCategoryController)
categoryRouter.get("/get", getCategoryController)

export default categoryRouter