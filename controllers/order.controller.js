import cartProductModel from "../models/cartProduct.model.js";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

//Addordercontroller
export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const userId = req.userId; //midleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
    if (userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "user not found",
      });
    }
    const payload = list_items.map((el, index) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.product._id,
        product_details: {
          name: el.product.name,
          image: el.product.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generateOrder = await orderModel.insertMany(payload);

    //remove from the cart
    const removeCartItems = await cartProductModel.deleteMany({ userId: userId });
    const updateInUser = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        shopping_cart: [],
      }
    );

    return res.json({
        message : 'order successfuly',
        error : false,
        success : true,
        data : generateOrder,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
