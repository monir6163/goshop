import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
  orders: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressList: (state, action) => {
      state.addressList = [...action.payload];
    },
    setOrders: (state, action) => {
      state.orders = [...action.payload];
    },
  },
});

export const { setAddressList, setOrders } = addressSlice.actions;

export default addressSlice.reducer;
