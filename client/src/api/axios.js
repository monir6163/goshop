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
// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     let originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest.retry) {
//       originalRequest.retry = true;
//       const refreshToken = localStorage.getItem("refreshToken");
//       // check refreshToken is valid time or not
//       decoded_Token_Refresh(refreshToken);
//       if (refreshToken) {
//         const newAccessToken = await refreshAccessToken(refreshToken);
//         if (newAccessToken) {
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return Axios(originalRequest);
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and it's not already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Fetch the refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      decoded_Token_Refresh(refreshToken);
      // Validate refreshToken
      if (!refreshToken) {
        console.error("No refresh token available");
        return Promise.reject(error); // Stop retrying
      }

      try {
        // Attempt to refresh the access token
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // Update the request's Authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError.message);
        // Redirect to login or handle logout logic
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Example: Redirect to login
        return Promise.reject(refreshError); // Stop retrying
      }
    }

    // Handle non-401 errors or failed refresh
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
    return Promise.reject(error);
  }
};
