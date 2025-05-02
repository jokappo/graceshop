import cartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

//Addtocartitemcontroller
export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required",
      });
    }

    const cartItem = new cartProductModel({
      product: productId,
      user: userId,
      quantity: 1,
    });

    const save = await cartItem.save();
    // Check if the product is already in the cart
    const existingCartItem = await cartProductModel.findOne({
      product: productId,
      user: userId,
    });
    if (existingCartItem) {
      return res.status(400).json({
        message: "Product already exists in the cart",
        success: false,
        error: true,
      });
    }


    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    return res.json({
      success: true,
      error: false,
      message: "Product added to cart successfully",
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: error.message,
    });
  }
};
