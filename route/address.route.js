import { Router } from "express";
import { addAddressController, deleteAddressController, editAddressController, getAddressController } from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const addressRouter = Router();

addressRouter.post('/create', auth, addAddressController)
addressRouter.get('/get', auth, getAddressController)
addressRouter.put('/update', auth, editAddressController)
addressRouter.delete('/desable', auth, deleteAddressController)


export default addressRouter;