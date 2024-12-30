import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
  orders: [],
  ordersByAdmin: [],
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
    setOrdersByAdmin: (state, action) => {
      state.ordersByAdmin = [...action.payload];
    }
  },
});

export const { setAddressList, setOrders, setOrdersByAdmin } = addressSlice.actions;

export default addressSlice.reducer;
