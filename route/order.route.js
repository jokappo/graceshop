import { Router } from "express";
import { cashOnDeliveryOrderController } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", cashOnDeliveryOrderController)

export default orderRouter;