import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddProductContoller,
  DeleteProductControler,
  GetProductByCategoryAndSubcategoryController,
  GetProductByCategoryController,
  GetProductController,
  GetProductDetailsController,
  UpdateProductController,
} from "../controllers/product.controller.js";
import { admin } from "../middleware/admin.js";

const productRouter = Router();

productRouter.post("/create", auth, admin, AddProductContoller);
productRouter.post("/get", GetProductController);
productRouter.post("/get-product-by-category", GetProductByCategoryController);
productRouter.post(
  "/get-product-by-category-and-subcategory",
  GetProductByCategoryAndSubcategoryController
);
productRouter.post("/get-product-details", GetProductDetailsController);

//upadate product
productRouter.put(
  "/update-product-details",
  auth,
  admin,
  UpdateProductController
);

//delete
productRouter.delete("/delete-product", auth, admin, DeleteProductControler);

export default productRouter;
