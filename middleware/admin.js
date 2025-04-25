import UserModel from "../models/user.model.js";
export const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(400).json({
        message: "Unauthorized",
        error: true,
        success: false,
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: "admin permission denial",
      error: true,
      success: false,
    });
  }
};
