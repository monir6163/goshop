/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { useGlobalContext } from "../provider/GlobalProvider";
import { axiosToastError } from "../utils/axiosToastError";
export default function AddressModal({ close, editData, mode }) {
  // console.log(editData);
  const { fetchAddressData } = useGlobalContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const { data: res } = await Axios({
        ...apiSummary.storeAddress,
        data: {
          address_line: data?.address_line,
          city: data?.city,
          state: data?.state,
          pincode: data?.pincode,
          country: data?.country,
          phone: data?.phone,
        },
      });
      if (res?.success) {
        fetchAddressData();
        toast.success(res?.message);
        close();
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  const onEditSubmit = async (data) => {
    try {
      const { data: res } = await Axios({
        ...apiSummary.updateAddress,
        data: {
          _id: editData?._id,
          address_line: data?.address_line,
          city: data?.city,
          state: data?.state,
          pincode: data?.pincode,
          country: data?.country,
          phone: data?.phone,
        },
      });
      if (res?.success) {
        fetchAddressData();
        toast.success(res?.message);
        close();
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  return (
    <section className="bg-black fixed top-0 left-0 bottom-0 right-0 z-50 bg-opacity-70 p-4 min-h-screen overflow-auto">
      <div className="bg-white p-4 w-full max-w-lg mx-auto rounded">
        <div className="flex items-center justify-between">
          {mode === "edit" ? (
            <h2 className="font-semibold">Edit Delivery Address</h2>
          ) : (
            <h2 className="font-semibold">Add Delivery Address</h2>
          )}
          <button onClick={close} className="w-fit block ml-auto animate-pulse">
            <IoClose size={24} />
          </button>
        </div>
        <form
          onSubmit={
            mode === "edit"
              ? handleSubmit(onEditSubmit)
              : handleSubmit(onSubmit)
          }
          className="mt-4 grid gap-2"
        >
          <div className="">
            <label htmlFor="address_line">Address Line:</label>
            <input
              type="text"
              id="address_line"
              name="address_line"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your address"
              defaultValue={editData?.address_line}
              {...register("address_line", { required: true })}
            />
            {errors?.address_line && (
              <span className="text-red-500">Address is required</span>
            )}
          </div>
          <div className="">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your city"
              defaultValue={editData?.city}
              {...register("city", { required: true })}
            />
            {errors?.city && (
              <span className="text-red-500">City is required</span>
            )}
          </div>
          <div className="">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your state"
              defaultValue={editData?.state}
              {...register("state", { required: true })}
            />
            {errors?.state && (
              <span className="text-red-500">State is required</span>
            )}
          </div>
          <div className="">
            <label htmlFor="pincode">Pincode:</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your pincode"
              defaultValue={editData?.pincode}
              {...register("pincode", { required: true })}
            />
            {errors?.pincode && (
              <span className="text-red-500">Pincode is required</span>
            )}
          </div>
          <div className="">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your country"
              defaultValue={editData?.country}
              {...register("country", { required: true })}
            />
            {errors?.country && (
              <span className="text-red-500">Country is required</span>
            )}
          </div>
          <div className="">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="w-full p-2 border border-blue-100 bg-blue-50 focus-within:border-blue-300 outline-none rounded"
              placeholder="Enter your phone"
              defaultValue={editData?.phone}
              {...register("phone", { required: true })}
            />
            {errors?.phone && (
              <span className="text-red-500">Phone is required</span>
            )}
          </div>
          <div className="mt-4">
            <button className="bg-blue-800 text-white p-2 rounded w-full">
              {isSubmitting
                ? "Adding..."
                : `${mode === "edit" ? "Update" : "Add"}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
