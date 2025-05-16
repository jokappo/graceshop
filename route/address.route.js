import { Router } from "express";
import { addAddressController } from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const addressRouter = Router();

addressRouter.post('/create', auth, addAddressController)


export default addressRouter;