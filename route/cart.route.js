import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, deleteCartItemController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/create', auth, addToCartItemController)
cartRouter.get('/get', auth, getCartItemController)
cartRouter.put('/update-qty', auth, updateCartItemQtyController)
cartRouter.delete('/delete', auth, deleteCartItemController)

export default cartRouter