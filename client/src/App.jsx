/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import allGetCat from "./api/allCat";
import featchBrand from "./api/featchBrand";
import featchCat from "./api/featchCat";
import featchSubCat from "./api/featchSubCat";
import featchLoggedInUser from "./api/featchUser";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MobileCart from "./components/MobileCart";
import GlobalProvider from "./provider/GlobalProvider";
import {
  setAllBrand,
  setAllCategory,
  setAllSubCategory,
  setGetAllCategory,
  setLoadingCategory,
} from "./redux/productSlice";
import { setUser } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const pathname = useLocation()?.pathname;
  const featchUser = async () => {
    const userData = await featchLoggedInUser();
    if (userData) {
      dispatch(setUser(userData));
    }
  };

  const fetchCategories = async () => {
    dispatch(setLoadingCategory(true));
    const catData = await featchCat();
    const getAllCat = await allGetCat();
    if (catData && getAllCat) {
      dispatch(setAllCategory(catData));
      dispatch(setGetAllCategory(getAllCat));
      dispatch(setLoadingCategory(false));
    }
  };
  const fetchSubCat = async () => {
    const subCatData = await featchSubCat();
    if (subCatData) {
      dispatch(setAllSubCategory(subCatData));
    }
  };
  const fetchBrands = async () => {
    const brandsData = await featchBrand();
    if (brandsData) {
      dispatch(setAllBrand(brandsData));
    }
  };
  useEffect(() => {
    featchUser();
    fetchCategories();
    fetchSubCat();
    fetchBrands();
  }, []);
  return (
    <GlobalProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      {pathname !== "/checkout" && <MobileCart />}
    </GlobalProvider>
  );
}

export default App;
