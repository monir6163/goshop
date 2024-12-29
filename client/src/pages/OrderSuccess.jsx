/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
   const {
      featchCartData,
      user
    } = useGlobalContext();
  useEffect(() => {
    if (!location.state) {
      // navigate("/");
    }
   
  }, [location, navigate]);
  useEffect(() => {
    if (featchCartData) {
      featchCartData();
    }
  }, [user]);
  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl mb-2">
          Thanks for your order!
        </h2>
        <p className="text-gray-500  mb-6 md:mb-8 inline-block">
          Your order will be processed within 24 hours during working days. We will notify
          you by email once your order has been shipped.
        </p>
       
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-green-100 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Return to shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
