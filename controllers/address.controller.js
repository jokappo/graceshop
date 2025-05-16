import addressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

//add address controller
export const addAddressController = async (req, res) => {
  try {
    const { address_line, city, state, pincode, country, mobile } = req.body;
    const userId = req.userId;
    console.log(userId);

    // Check if all field are filled
    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: true,
      });
    }

    const createAddress = new addressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId,
    });

    // Check if address already exists
    const addressExists = await addressModel.findOne({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
    });

    if (addressExists) {
      return res.status(400).json({
        success: false,
        message: "Address already exists",
        error: true,
      });
    }
    // Save address
    const saveAddress = await createAddress.save();

    const addUserAddress = await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: saveAddress._id },
    });

    return res.json({
      success: true,
      error: false,
      message: "Address added successfully",
      data: saveAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

//get address controller
export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        const data = await addressModel.find({ userId }).populate("userId", "name email");
        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Address not found",
                error: true,
            });
        }
        return res.json({
            success: true,
            error: false,
            message: "Address fetched successfully",
            data: data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error,
            error: true,
        });
        
    }
}
