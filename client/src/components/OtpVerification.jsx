import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { axiosToastError } from "../utils/axiosToastError";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef([]);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location?.state?.email, navigate]);

  const validValue = otp.every((value) => value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios({
        ...apiSummary.verifyOtp,
        data: {
          otp: otp.join(""),
          email: location?.state?.email,
        },
      });
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        navigate("/reset-password", {
          state: { data: data, email: location?.state?.email },
        });
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      axiosToastError(error);
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-full items-center flex-1 flex-col py-12">
      <div className="w-full bg-white py-4 rounded">
        <div className="mt-5 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Enter OTP
              </label>
              <div className="mt-2 flex w-full justify-between">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isNaN(value)) return;
                      setOtp([...otp.map((v, i) => (i === index ? value : v))]);
                      if (value && index < otp.length - 1) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                disabled={!validValue}
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-800"
              >
                {loading ? "Loading..." : "Verify OTP"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
