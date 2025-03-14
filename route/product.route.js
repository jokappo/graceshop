import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductContoller, GetProductByCategoryController, GetProductController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/create', auth, AddProductContoller)
productRouter.post('/get', GetProductController)
productRouter.post('/get-product-by-category', GetProductByCategoryController)

export default productRouter