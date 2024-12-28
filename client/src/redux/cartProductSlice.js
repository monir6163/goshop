import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartProductSlice = createSlice({
  name: "cartItem",
  initialState: initialState,
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = Array.isArray(action.payload) ? [...action.payload] : [];
    },
  },
});

export const { handleAddItemCart } = cartProductSlice.actions;

export default cartProductSlice.reducer;
