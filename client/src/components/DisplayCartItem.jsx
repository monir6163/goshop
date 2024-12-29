/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { FaCaretRight } from "react-icons/fa6";
import { GoX } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { useEffect } from "react";

export default function DisplayCartItem({ close }) {
  const { notDiscountTotalPrice, toatalPric, cartItem, totalQty, user } =
    useGlobalContext();
  const navigate = useNavigate();
  useEffect(() => {
    // check cart item is empty then this page can't be access
    if (cartItem.length === 0) {
      navigate('/')
    }
  }, [cartItem, navigate]);
  const redirectCheckout = () => {
    if (user?._id === "") {
      toast.error("Please login to continue");
      return;
    }
    navigate("/checkout", {
      state: {
        cartItem: cartItem
      },
  });
    close();
  };

  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-2 justify-between shadow-md">
          <h2>My Cart Data - ({totalQty})</h2>
          <Link
            to="/"
            className="text-neutral-100 bg-neutral-900 rounded lg:hidden hover:bg-neutral-700 animate-pulse "
            onClick={close}
          >
            <GoX size={30} />
          </Link>
          <button
            className="text-neutral-100 bg-neutral-900 rounded hidden lg:block hover:bg-neutral-700 animate-pulse "
            onClick={close}
          >
            <GoX size={30} />
          </button>
        </div>

        <div className="min-h-[77vh] lg:min-h-[84vh] h-full max-h-[calc(100vh-100px)] bg-blue-50 flex flex-col">
          {/* display item */}
          {cartItem[0]?.product_id?.discount && (
            <div className="flex items-center justify-between p-2 bg-green-100 text-green-800 text-sm">
              <p>Your Total Savings :</p>
              <p>{DisplayPriceInRupees(notDiscountTotalPrice - toatalPric)}</p>
            </div>
          )}

          <div className="grid overflow-auto py-2">
            {!cartItem[0] && (
              <div className="text-center flex items-center justify-center min-h-[55vh] lg:min-h-[84vh] h-full max-h-[calc(100vh-100px)] text-lg text-neutral-700">
                <p>Cart is Empty</p>
              </div>
            )}
            {cartItem[0] &&
              cartItem?.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="bg-white 
                    border border-b-slate-300 p-2 flex items-center w-full gap-2"
                  >
                    <div className="w-16 h-16 rounded shadow">
                      <img
                        src={item?.product_id?.thumbnail || item?.product_id?.image[0]}
                        alt={item?.product_id?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full max-w-sm text-xs">
                      <p className="text-sm text-wrap text-ellipsis line-clamp-1">
                        {item?.product_id?.name}
                      </p>
                      <p className="text-xs text-neutral-700">
                        {item?.product_id?.unit}
                      </p>
                      <p className="text-xs font-semibold">
                        {DisplayPriceInRupees(
                          pricewithDiscount(
                            item?.product_id?.price,
                            item?.product_id?.discount
                          )
                        )}
                      </p>
                    </div>
                    <div>
                      <AddToCartButton data={item?.product_id} />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="border-b border-slate-300"></div>
          <div className="bg-white p-4">
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
          </div>
        </div>
        <div className="bg-green-800 text-neutral-100 p-2 sticky bottom-0 flex items-center justify-between gap-4 py-4">
          <div>{DisplayPriceInRupees(toatalPric)}</div>
          <button
            disabled={!cartItem[0] || !user?._id}
            className="flex items-center gap-1
           bg-green-900 hover:bg-green-700 px-2 py-1 rounded text-white"
            onClick={redirectCheckout}
          >
            Proceed
            <span>
              <FaCaretRight />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
