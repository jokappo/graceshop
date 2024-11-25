import sendEmail from "../config/senEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifuEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOTP from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotpasswordTemplate.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    //verifier si l'utilisateur a rempli les cases
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "provide name, email and password",
        error: true,
        success: false,
      });
    }
    //verifier si l'email est valide
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "invalid email",
        error: true,
        success: false,
      });
    }
    //verifier si l'email existe deja dans la base de données
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "user already exists",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FROMTEND_URL}/verify-email?code=${save?._id}`;

    const verify_email = await sendEmail({
      sendTo: email,
      subject: "verify email from GraceShop",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "user created successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(404).json({
        message: "Invalide code",
        error: true,
        success: false,
      });
    }

    const upateUser = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );

    return res.json({
      message: "Email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//login controller
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }

    //verifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.status !== "active") {
      return res.status(400).json({
        message: "contact a admin",
        error: true,
        success: false,
      });
    }
    //verifier le mot de passe
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return res.json({
      message: "Login success",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//lodout controller
export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//upload user avatar
export async function uploadAvatarController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const image = req.file; //multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });
    return res.json({
      message: "Avatar uploaded successfully",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//update user detail
export async function updateUserController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { name, email, password, mobile } = req.body;

    // Validation : Vérifiez si au moins un champ est fourni
    if (!name && !email && !password && !mobile) {
      return res.status(400).json({
        message: "No fields provided for update",
        error: true,
        success: false,
      });
    }

    //hacher le mot de passe avant de le passer
    let hashedPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    // Mise à jour conditionnelle des champs
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }), //si le nom n'xiste pas, d'ajouer le nom saisie dans le body
        ...(email && { email: email }),
        ...(password && { password: hashedPassword }),
        ...(mobile && { mobile: mobile }),
      }
    );

    // Si l'utilisateur n'est pas trouvé
    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Si l'utilisateur est trouvé et mis à jour avec succès
    return res.json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    //verifier si l'user exist
    if (!user) {
      return res.status(404).json({
        message: "email not avalable",
        error: true,
        success: false,
      });
    }

    const OTP = generateOTP();
    const expireTime = new Date() + 60 * 60 * 1000; //h

    //uptate
    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_expiry: new Date(expireTime).toISOString(),
      forgot_password_otp: OTP,
    });

    await sendEmail({
      sendTo: email,
      subject: "Reset Password",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: OTP,
      }),
    });

    return res.json({
      message: "OTP sent to your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//verify forgot verify otp
export const verifyForgotPasswordOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    //verifier si on a passé l'email le otp
    if (!email || !otp) {
      return res.status(400).json({
        message: "provide email and otp",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    //verifier si l'email est dans la base de donnée
    if (!user) {
      return res.status(404).json({
        message: "email not avalable",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString()

    //veifier si lotp a expiré
    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false,
      });
    }

    //verifuer si lotp est valide
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    //verifier si tout les champs ont ete rempli
    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "Please fill all fields",
        error: true,
        success: false,
      });
    }

    //verifier si luser existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    //verifier la confirmation du mot de passe
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword,salt)

    const update = await UserModel.findOneAndUpdate(user, {
      password : hashedPassword
    })

    return res.json({
      message: "Password reset successfully",
      error: false,
      success: true,
    })


  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
