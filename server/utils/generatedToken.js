import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const generatedAccessToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.EXPIRE_ACCESS_TOKEN,
  });

  return token;
};

const genertedRefreshToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.EXPIRE_REFRESH_TOKEN,
  });

  await UserModel.updateOne(
    { _id: userId },
    {
      refresh_token: token,
    }
  );

  return token;
};

export default { generatedAccessToken, genertedRefreshToken };
