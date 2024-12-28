/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartLoader from "../utils/AddToCartLoader";
import { axiosToastError } from "../utils/axiosToastError";

const AddToCartButton = ({ data }) => {
  const { featchCartData, updateCartQty, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();

  //add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const { data: res } = await Axios({
        ...apiSummary.addToCart,
        data: {
          productId: data?._id,
        },
      });
      if (res.success) {
        toast.success(res.message);
        featchCartData();
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  //checking this item in cart or not
  useEffect(() => {
    const checkingitem = cartItem.some(
      (item) => item.product_id._id === data._id
    );
    setIsAvailableCart(checkingitem);

    const product = cartItem.find((item) => item.product_id._id === data._id);
    setQty(product?.qty);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  //increase qty
  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // check stock qty and cart qty
    if (qty >= data.stock) {
      toast.error("Out of stock");
      return;
    }

    await updateCartQty(cartItemDetails?._id, qty + 1);
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      await updateCartQty(cartItemDetails?._id, qty - 1);
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="bg-green-800 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaMinus />
          </button>

          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
            {qty}
          </p>

          <button
            onClick={increaseQty}
            className="bg-green-800 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-800 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? <AddToCartLoader /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
