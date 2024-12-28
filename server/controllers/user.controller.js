import jwt from "jsonwebtoken";
import sendMail from "../config/node.mailer.js";
import UserModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/emailTemplate.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import generatedOtp from "../utils/generatedOtp.js";
import generatedToken from "../utils/generatedToken.js";
import { cloudinaryUpload } from "../utils/uploadImageClodinary.js";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Field are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(500).json({
        message: "User already exist this email",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      email,
      password,
    };
    const newUser = new UserModel(payload);
    const save = await newUser.save();
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
    await sendMail({
      sendTo: save?.email,
      subject: "verify email from mern-ecom",
      html: verifyEmailTemplate({
        name: save?.name,
        url: verifyUrl,
      }),
    });
    return res
      .status(201)
      .json({ message: "User Register Success", error: false, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function emailVerify(req, res) {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Token", error: true, success: false });
    }
    await UserModel.updateOne({ _id: code }, { verify_email: true });
    return res
      .status(200)
      .json({ message: "Email Verify Success", error: false, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function UserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(204).json({
        message: "All Field are required",
        error: true,
        success: false,
      });
    }

    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) {
      return res.status(404).json({
        message: "user not found this email",
        error: true,
        success: false,
      });
    }
    const checkpass = await findUser.isPasswordCorrect(password);
    if (!checkpass) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }
    if (findUser.status !== "Active") {
      return res.status(401).json({
        message: "Account not Active",
        error: true,
        success: false,
      });
    }

    if (findUser.verify_email === false) {
      return res.status(401).json({
        message: "User email not verify",
        error: true,
        success: false,
      });
    }
    const accessToken = await generatedToken.generatedAccessToken(findUser._id);
    const refreshToken = await generatedToken.genertedRefreshToken(
      findUser._id
    );

    await UserModel.findByIdAndUpdate(
      findUser._id,
      {
        last_login_date: new Date().toISOString(),
      },
      { new: true }
    );

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);
    return res.status(200).json({
      message: "Use login success",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function userLogout(req, res) {
  try {
    const id = req.userId;
    await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { refresh_token: "" },
      },
      {
        new: true,
        select: "-password -refresh_token",
      }
    );
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);
    return res.status(200).json({
      message: "User logout success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function uploadAvater(req, res) {
  try {
    const id = req.userId;
    const image = req.file;
    if (!image) {
      return res
        .status(204)
        .json({ message: "Image is required", error: true, success: false });
    }
    const upload = await cloudinaryUpload(image, "ecom/user");
    if (!upload) {
      return res
        .status(204)
        .json({ message: "Image upload Failed", error: true, success: false });
    }
    await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { avater: upload.url },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Update User avater",
      error: false,
      success: true,
      data: upload.url,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function userDetailsUpdate(req, res) {
  try {
    const id = req.userId;
    const { name, phone, email } = req.body;
    const data = await UserModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name }),
        ...(phone && { phone: phone }),
        ...(email && { email: email }),
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Update User Details",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(204)
        .json({ message: "Email is required", error: true, success: false });
    }
    const user = await UserModel.findOne({ email: email }).select(
      "-password -refresh_token"
    );
    if (!user) {
      return res.status(404).json({
        message: "user not exists this email",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(401).json({
        message: "Account not Active",
        error: true,
        success: false,
      });
    }
    if (user.verify_email === false) {
      return res.status(401).json({
        message: "User email not verify",
        error: true,
        success: false,
      });
    }

    const otp = generatedOtp();
    const expireTime = new Date() + 60 * 60 * 1000;
    const setOtp = await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime).toISOString(),
      },
      { new: true }
    );

    if (setOtp) {
      await sendMail({
        sendTo: user.email,
        subject: "Forgot password otp form mern-ecom",
        html: forgotPasswordTemplate({ name: user?.name, otp: otp }),
      });
    }
    return res.status(200).json({
      message: "otp send success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function verifyForgotPassword(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email & Otp are required",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email: email }).select(
      "-password -refresh_token"
    );
    if (!user) {
      return res.status(404).json({
        message: "user not exists this email",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(401).json({
        message: "Account not Active",
        error: true,
        success: false,
      });
    }
    if (user.verify_email === false) {
      return res.status(401).json({
        message: "User email not verify",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "otp is Invalid",
        error: true,
        success: false,
      });
    }
    const currentTime = new Date().toISOString();
    if (user.forgot_password_expiry < currentTime) {
      return res.status(410).json({
        message: "otp has expired",
        error: true,
        success: false,
      });
    }

    // delete otp and expiry time
    await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: null,
        forgot_password_expiry: "",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "otp verify success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "all field are required",
        error: true,
        success: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "password and confirmPassword not matched",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email: email }).select(
      "-password -refresh_token"
    );
    if (!user) {
      return res.status(404).json({
        message: "user not exists this email",
        error: true,
        success: false,
      });
    }

    user.password = password;
    user.forgot_password_otp = null;
    user.forgot_password_expiry = "";
    await user.save();

    return res.status(200).json({
      message: "Password reset success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function refreshToken(req, res) {
  try {
    const refToken =
      req.cookies.refreshToken || req.headers.authorization.split(" ")[1];
    if (!refToken) {
      return res.status(401).json({
        message: "refreshToken provide",
        success: false,
        error: true,
      });
    }
    const decoded = jwt.verify(refToken, process.env.REFRESH_TOKEN);
    if (!decoded) {
      return response.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found this token",
        success: false,
        error: true,
      });
    }

    if (refToken !== user.refresh_token) {
      return res.status(401).json({
        message: "refreshToken not matched",
        success: false,
        error: true,
      });
    }
    const accessToken = await generatedToken.generatedAccessToken(user._id);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function userDetails(req, res) {
  try {
    const id = req.userId;

    const user = await UserModel.findById(id).select(
      "-password -refresh_token"
    );

    return res.status(200).json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false,
    });
  }
}
