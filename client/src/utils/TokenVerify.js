import { jwtDecode } from "jwt-decode";
import { axiosToastError } from "./axiosToastError";

export const decoded_Token = (token) => {
  if (token) {
    try {
      const decode_token = jwtDecode(token);
      const exp = new Date(decode_token.exp * 1000); // to convert seconds to milliseconds
      if (new Date() > exp) {
        console.log("Token is expired");
        localStorage.removeItem("accessToken");
        return "";
      } else {
        console.log("Token is not expired");
        // token is not expired then return token
        return decode_token ? token : "";
      }
    } catch (error) {
      console.log(error);
      return axiosToastError("Token is not valid");
    }
  } else {
    return "";
  }
};

export const decoded_Token_Refresh = (token) => {
  if (token) {
    try {
      const decode_token = jwtDecode(token);
      const exp = new Date(decode_token.exp * 1000); // to convert seconds to milliseconds
      if (new Date() > exp) {
        console.log("Rf Token is expired");
        localStorage.removeItem("refreshToken");
        return "";
      } else {
        console.log("Rf Token is not expired");
        // token is not expired then return token
        return decode_token ? token : "";
      }
    } catch (error) {
      console.log(error);
      return axiosToastError("Rf Token is not valid");
    }
  } else {
    return "";
  }
};
