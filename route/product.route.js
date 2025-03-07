import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductContoller, GetProductController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/create', auth, AddProductContoller)
productRouter.post('/get', GetProductController)

export default productRouter