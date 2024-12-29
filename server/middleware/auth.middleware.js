import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
dotenv.config();
export const authProtect = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please Login First",
        success: false,
        error: true,
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await UserModel.findById(decoded.id).select(
      "-password -refresh_token"
    );
    if (!user) {
      return res.status(401).json({
        message: "User not found this token",
        success: false,
        error: true,
      });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Please Login First",
      success: false,
      error: true,
    });
  }
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!roles.includes(user.role)) {
      return res.status(401).json({
        message: "Unauthorized.Don't have permision for this route",
        success: false,
        error: true,
      });
    }
    next();
  };
};
