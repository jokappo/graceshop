import cartProductModel from "../models/cartProduct.model.js";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import { priceWithDiscount } from "../utils/priceWithDiscount.js";
import Stripe from "../config/stripe.js";

//Addordercontroller
export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const user = req.userId; //midleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
    if (!user) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "user not found",
      });
    }
    const payload = list_items.map((el, index) => {
      return {
        userId: user,
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
    const removeCartItems = await cartProductModel.deleteMany({
      user: user,
    });
    console.log("Remove Cart Items Result:", removeCartItems);

    //update the user
    const updateInUser = await UserModel.updateOne(
      {
        _id: user,
      },
      {
        shopping_cart: [],
      }
    );

    return res.json({
      message: "order successfuly",
      error: false,
      success: true,
      data: generateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// payement controller
export const paymentController = async (req, res) => {
  try {
    const userId = req.userId; //midleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    //Vérification de l'utilisateur
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing. Authentication required.",
        success: false,
        error: true,
      });
    }
    //Vérification de l'adresse de livraison
    if (!addressId) {
      return res.status(400).json({
        message: "Shipping address is required.",
        success: false,
        error: true,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    // Map each order item to a Stripe line item object
    const line_Items = list_items.map((item, index) => {
      // Create a Stripe line item for each product in the order
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: item.product.image,
            metadata: {
              productId: item.product._id,
            },
          },
          // Calculate the unit amount with discount applied
          unit_amount:
            priceWithDiscount(item.product.price, item.product.dicount) * 100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_Items,
      success_url: `${process.env.FROMTEND_URL}/success`,
      cancel_url: `${process.env.FROMTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getOrderProduct = async ({
  lineItems,
  userId,
  addressId,
  payementId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      /**
       * Payload object representing an order.
       * @typedef {Object} Payload
       * @property {string} userId - The ID of the user placing the order.
       * @property {string} orderId - The unique order ID, prefixed with 'ORD-'.
       * @property {string} productId - The ID of the product being ordered.
       * @property {Object} product_details - Details about the product.
       * @property {string} product_details.name - The name of the product.
       * @property {string} product_details.image - The image URL of the product.
       * @property {string} paymentId - The payment intent ID associated with the order.
       * @property {string} payment_status - The status of the payment.
       * @property {string} delivery_address - The ID of the delivery address.
       * @property {number} subTotalAmt - The subtotal amount for the order (in main currency units).
       * @property {number} totalAmt - The total amount for the order (in main currency units).
       */
      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: payementId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(payload);
    }
  }

  return productList;
};

//http://localhost:8080/api/order/webhook
export const webhookStripeController = async (req, res) => {
  const event = req.body;

  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const addressId = session.metadata.addressId;
      console.log("lineItems : ", lineItems);

      const orderProduct = await getOrderProduct({
        lineItems: lineItems,
        userId: userId,
        addressId: addressId,
        payementId: session.payment_intent,
        payment_status: session.payment_status,
      });
      console.log("orderProduct : ", orderProduct);

      const order = await orderModel.insertMany(orderProduct);

      // If the order was created, clear the user's shopping cart and remove cart products
      if (order) {
        const updateInUser = await UserModel.findByIdAndUpdate(
          {
            _id: userId,
          },
          {
            shopping_cart: [],
          }
        );

        const removeCartProduct = await cartProductModel.deleteMany({
          user: userId,
        });
      }

      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

//get order details
export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User ID is missing. Authentication required.",
      });
    }

    const orderList = await orderModel
      .find({ userId: userId })
      .sort({
        createdAt: -1,
      })
      .populate([
        { path: "productId" },
        { path: "userId" },
        { path: "delivery_address" },
      ]);

    // Return the fetched order list
    return res.status(200).json({
      error: false,
      success: true,
      data: orderList,
      message: "Order details fetched successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
