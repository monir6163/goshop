import axios from "axios";
import { decoded_Token, decoded_Token_Refresh } from "../utils/TokenVerify";
import apiSummary, { baseUrl } from "./api";
export const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

//axios interceptors for send cookies with every request
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    // check accessToken is valid time or not
    decoded_Token(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//axios interceptors for handling 401 error
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      // check refreshToken is valid time or not
      decoded_Token_Refresh(refreshToken);
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

//function to refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const { data } = await Axios({
      ...apiSummary.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    localStorage.setItem("accessToken", data?.data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};
