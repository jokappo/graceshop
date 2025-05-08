import cartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

//Addtocartitemcontroller
export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    // Vérification que le productId est fourni
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required",
      });
    }

    // Vérifier si le produit existe déjà dans le panier de l'utilisateur
    const existingCartItem = await cartProductModel.findOne({
      product: productId,
      user: userId,
    });

    if (existingCartItem) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product already exists in the cart",
      });
    }

    // Ajouter un nouvel élément au panier
    const cartItem = new cartProductModel({
      product: productId,
      user: userId,
      quantity: 1,
    });

    const save = await cartItem.save();

    // Mettre à jour le champ `shopping_cart` de l'utilisateur
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { shopping_cart: productId } } // $addToSet empêche les doublons
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
      message: error.message || "Internal Server Error",
      error: true,
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

//updateCartItemQtyController
export const updateCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, quantity } = req.body;

    // Vérification des champs requis
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized user",
      });
    }

    if (!_id || !quantity) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cart item ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Quantity must be greater than zero",
      });
    }

    // Mettre à jour l'élément du panier
    const updateCartItem = await cartProductModel.updateOne(
      { _id: _id, user: userId }, // Vérification que l'élément appartient à l'utilisateur
      { quantity: quantity }
    );

    // Vérification si l'élément a été trouvé et mis à jour
    if (updateCartItem.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Cart item not found or does not belong to user",
      });
    }

    return res.json({
      success: true,
      error: false,
      message: "Cart item quantity updated successfully",
      data: updateCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

//deleteCartItemController
export const deleteCartItemController = async (req, res) => {
  try {
    const userId = req.userId;//middleware
    const { _id } = req.body;

    // Vérification des champs requis
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized user",
      });
    }
    if (!_id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cart item ID is required",
      });
    }

    // Supprimer l'élément du panier
    const deleteCartItem = await cartProductModel.deleteOne({
      _id: _id,
      user: userId, // Vérification que l'élément appartient à l'utilisateur
    })

    return res.json({
      success: true,
      error: false,
      message: "Cart item deleted successfully",
      data: deleteCartItem,
    }); 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
    
  }
}

