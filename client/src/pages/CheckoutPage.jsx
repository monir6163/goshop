import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

import {useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import COD from "../assets/cash-on-delivery.png";
import SSL from "../assets/ssl.png";
import Stripe from "../assets/stripe.png";
import AddressModal from "../components/AddressModal";
import { axiosToastError } from "../utils/axiosToastError";
import {loadStripe} from '@stripe/stripe-js';

export default function CheckoutPage() {
  const {
    notDiscountTotalPrice,
    toatalPric,
    cartItem,
    totalQty,
    addressList,
    featchCartData,
    fetchAllOrders
  } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);
  const [stripeLoading, setStripeLoadin] = useState(false)

  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
    }, [location, navigate]);

  const handleCashOnDelivery = async () => {
    if (!selectedAddress) return toast.error("Please select an address");
    try {
      setCashLoading(true);
      toast.loading("Please Wait");
      const { data } = await Axios({
        ...apiSummary.createCashOrder,
        data: {
          list_items: cartItem,
          totalAmount: toatalPric,
          subTotalAmount: notDiscountTotalPrice,
          addressId: selectedAddress,
        },
      });
      if (data.success) {
        toast.success(data.message);
       
        if (featchCartData) {
          featchCartData();
          fetchAllOrders();
        }
        navigate("/order-success", {
          state: {
            order_id: data.data[0]?.order_id,
            payment_type: "Cash on delivery",
            payment_status: "Pending",
            product_name: data.data[0]?.product_details?.name,
            address: addressList.find(
              (address) => address?._id === selectedAddress
            ),
            date: data.data[0]?.createdAt,
          },
        });
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setCashLoading(false);
       //stop toast loading
       toast.remove();
    }
  };

  const handleStripePayment = async()=>{
    if (!selectedAddress) return toast.error("Please select an address");
    try {
     
      setStripeLoadin(true);
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const loadStripePromise = await loadStripe(stripePublicKey)
      toast.loading("Please Wait");
      const res = await Axios({
        ...apiSummary.createStripeOrder,
        data: {
          list_items: cartItem,
          totalAmount: toatalPric,
          subTotalAmount: notDiscountTotalPrice,
          addressId: selectedAddress,
        },
      });
      const {data:resData} = res;
      loadStripePromise.redirectToCheckout({sessionId:resData.id})
      if (featchCartData) {
        featchCartData();
        fetchAllOrders();
      }
    } catch (error) {
      axiosToastError(error)
    }finally{
      setStripeLoadin(false);
       //stop toast loading
       toast.remove();
    }
  }
  return (
    <section>
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* address */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold">Choose a delivery address</h3>
          <div className="bg-white p-4 grid gap-4 rounded">
            {addressList?.map((address, i) => {
              return (
                <label key={i} htmlFor={address?._id}>
                  <div
                    className={`rounded border border-slate-300 p-4 hover:border-green-500 transition-all hover:shadow-md
                    flex items-center gap-4 hover:bg-green-50 
                    ${
                      address?.status === false && "hidden"
                    }
                    `}
                  >
                    <div>
                      <input
                        disabled={!address?.status}
                        className={`${
                          address?.status
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                        type="radio"
                        name="address"
                        id={address?._id}
                        value={address?._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{address?.address_line}</p>
                      <p>{address?.city}</p>
                      <p>{address?.state}</p>
                      <p></p>
                      <p>
                        {address?.country} - ({address?.pincode})
                      </p>
                      <p>{address?.phone}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddressModal(true)}
              className="bg-blue-50 h-12 border border-blue-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-100"
            >
              Add new address
            </div>
          </div>
        </div>
        {/* payment */}
        <div>
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {cartItem[0]?.product_id?.discount &&
                    DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(toatalPric)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quntity total</p>
              <p className="flex items-center gap-2">{totalQty} item</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(toatalPric)}</p>
            </div>
            <div className="border-b border-slate-300 my-4"></div>
            <div className="flex flex-col gap-2 w-full">
              <button 
                onClick={handleStripePayment}
              className="bg-green-800 text-neutral-100 p-2 flex justify-center gap-2 rounded hover:bg-green-900 text-sm">
                <img src={Stripe} alt="cod" className="w-6 h-6" />
                {stripeLoading ? "Please wait..." : "Payment With Stripe"}
              </button>
              <button
                className="bg-green-800 text-neutral-100 p-2 flex justify-center gap-2 rounded hover:bg-green-900 text-sm"
                disabled
              >
                <img src={SSL} alt="cod" className="w-6 h-6" />
                Payment With SSLCommerz
              </button>
              <button
                onClick={handleCashOnDelivery}
                className="bg-green-800 text-neutral-100 flex justify-center gap-2 p-2 rounded hover:bg-green-900 text-sm"
              >
                <img src={COD} alt="cod" className="w-6 h-6" />
                {cashLoading ? "Please wait..." : "Cash On Delivery"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* address modal */}
      {openAddressModal && (
        <AddressModal close={() => setOpenAddressModal(false)} />
      )}
    </section>
  );
}
