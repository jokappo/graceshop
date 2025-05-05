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

    
    // Check if the product is already in the cart and encrise quantity
    const existingCartItem = await cartProductModel.findOne({
      product: productId,
      user: userId,
    });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return res.json({
        success: true,
        error: false,
        message: "Product quantity updated in cart",
        data: existingCartItem,
      });
    }
      const save = await cartItem.save();

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

//getcartitemcontroller
export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await cartProductModel
      .find({ user: userId })
      .populate("product")
      .populate("user");

    if (!cartItems) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No items found in the cart",
      });
    }

    return res.json({
      success: true,
      error: false,
      message: "Cart items retrieved successfully",
      data: cartItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};
