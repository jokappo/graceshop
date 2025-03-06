import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductContoller } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/create', auth, AddProductContoller)

export default productRouter