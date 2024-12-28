import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./addressSlice";
import cartProductReducer from "./cartProductSlice";
import productReducer from "./productSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartProductReducer,
    address: addressReducer,
  },
});
