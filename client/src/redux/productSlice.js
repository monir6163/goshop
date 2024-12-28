import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  loadingCategory: false,
  allSubCategory: [],
  allBrand: [],
  products: [],
  allCat: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload];
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
    setAllSubCategory: (state, action) => {
      state.allSubCategory = [...action.payload];
    },
    setAllBrand: (state, action) => {
      state.allBrand = [...action.payload];
    },

    setGetAllCategory: (state, action) => {
      state.allCat = [...action.payload];
    },

    setProducts: (state, action) => {
      state.products = [...action.payload];
    },
  },
});

export const {
  setAllCategory,
  setAllSubCategory,
  setAllBrand,
  setLoadingCategory,
  setGetAllCategory,
  setProducts,
} = productSlice.actions;

export default productSlice.reducer;
