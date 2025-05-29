import { Router } from "express";
import { cashOnDeliveryOrderController, paymentController, webhookStripeController } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery",auth, cashOnDeliveryOrderController)
orderRouter.post("/checkout", auth, paymentController)
orderRouter.post("/webhook", webhookStripeController)


export default orderRouter;