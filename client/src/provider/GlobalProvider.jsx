/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import featchCartItems from "../api/featchCartItems";
import { setAddressList, setOrders } from "../redux/addressSlice";
import { handleAddItemCart } from "../redux/cartProductSlice";
import { axiosToastError } from "../utils/axiosToastError";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

function GlobalProvider({ children }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state?.cartItem?.cart);
  const user = useSelector((state) => state?.user);
  const addressList = useSelector((state) => state?.address?.addressList);
  const allOrders = useSelector((state) => state?.address?.orders);
  const [toatalPric, setToatalPric] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  // fetch cart data
  const featchCartData = async () => {
    const cartData = await featchCartItems();
    if (cartData) {
      dispatch(handleAddItemCart(cartData));
    }
  };

  // update cart qty
  const updateCartQty = async (cartId, qty) => {
    try {
      const { data: res } = await Axios({
        ...apiSummary.updateCartItem,
        data: {
          cartId,
          qty,
        },
      });
      if (res.success) {
        toast.success(res.message);
        featchCartData();
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  // delete cart item
  const deleteCartItem = async (cartId) => {
    try {
      const { data: res } = await Axios({
        ...apiSummary.deleteCartItem,
        url: apiSummary.deleteCartItem.url.replace(":id", cartId),
      });
      if (res.success) {
        toast.success(res.message);
        featchCartData();
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  // fetch address data
  const fetchAddressData = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getAllAddress,
      });
      dispatch(setAddressList(data?.data));
    } catch (error) {
      return error;
    }
  };
  // get all orders
  const fetchAllOrders = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getAllOrders,
      });
      dispatch(setOrders(data?.data));
    } catch (error) {
      return error;
      
    }
  };
  //after logout clear
  useEffect(() => {
    featchCartData();
    fetchAddressData();
    fetchAllOrders();
    dispatch(handleAddItemCart([]));
  }, [user]);
  // calculate total qty and price
  useEffect(() => {
    const qty = cartItem.reduce((acc, item) => acc + item.qty, 0);
    const price = cartItem.reduce(
      (acc, item) =>
        acc +
        pricewithDiscount(item.product_id.price, item.product_id.discount) *
          item.qty,
      0
    );
    const notDiscountTotalPrice = cartItem.reduce(
      (acc, item) => acc + item.product_id.price * item.qty,
      0
    );
    setNotDiscountTotalPrice(notDiscountTotalPrice);
    setTotalQty(qty);
    setToatalPric(price);
  }, [cartItem]);

  return (
    <GlobalContext.Provider
      value={{
        featchCartData,
        updateCartQty,
        deleteCartItem,
        notDiscountTotalPrice,
        toatalPric,
        totalQty,
        cartItem,
        user,
        addressList,
        allOrders,
        fetchAddressData,
        fetchAllOrders,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
