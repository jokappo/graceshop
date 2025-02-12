import { Router } from "express";
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const categoryRouter = Router()

categoryRouter.post("/add-category", auth, AddCategoryController)
categoryRouter.get("/get",auth, getCategoryController)
categoryRouter.put("/update", auth, updateCategoryController)
categoryRouter.delete("/delete", auth, deleteCategoryController)

export default categoryRouter