/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { uploadSingleImage } from "../../utils/UploadImage";
import { axiosToastError } from "../../utils/axiosToastError";
import { Axios } from "../../api/axios";
import apiSummary from "../../api/api";

export default function BannerModel({ close }) {
  const [data, setData] = useState({
    imgType: "desktop",
    image: "",
    banerLink: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadBrandImage = async (e) => {
    setBrandLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const { data } = await uploadSingleImage(file);
    setData((prev) => ({ ...prev, image: data.data.url }));
    if (data?.data?.url) {
      toast.success(data.message);
      setBrandLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const payload = {
            imgType: data.imgType,
            image: data.image,
            banerLink: data.banerLink,
        };
        const {data:res} = await Axios({
            ...apiSummary.putBannerImage,
            data: payload,
        })
        if(res.success){
            toast.success(res.message);
            close();
        }
    } catch (error) {
        axiosToastError(error);
    }finally{
        setSubmitting(false);
        e.target.reset();
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 p-4 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-4 rounded">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Add Banner Image</h2>
          <button onClick={close} className="w-fit block ml-auto animate-pulse">
            <IoClose size={24} />
          </button>
        </div>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mt-2">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="py-5">
        <div>
          <label htmlFor="banerLink" className="block text-sm pb-2">
            Banner Link <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="banerLink"
            name="banerLink"
            value={data.banerLink}
            onChange={handleChange}
            placeholder="baner Link"
            className="w-full border rounded px-2 py-2 outline-none focus-within:border-green-600"
          />
        </div>

        <div className="pt-2 pb-2">
        <label htmlFor="imgType" className="block text-sm pb-2">
            Banner Type <span className="text-red-600">*</span>
        </label>
        <select name="imgType" id="imgType" onChange={handleChange} value={data.imgType} className="w-full border rounded px-2 py-2 outline-none focus-within:border-green-600">
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
        </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm pb-2">
            Banner Image <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-col items-center lg:flex-row lg:gap-4">
            <div className="border bg-blue-50 h-10 w-10 lg:w-36 lg:h-20 rounded-full lg:rounded flex items-center justify-center">
              {brandLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  {data.image ? (
                    <img
                      src={data.image}
                      alt={data.banerLink}
                      className="h-full w-full object-scale-down rounded-full"
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">No Image</p>
                  )}
                </>
              )}
            </div>
            {!brandLoading && (
              <label htmlFor="banner_image">
                <div
                  className={`${
                    !data.banerLink ? "bg-gray-300" : "bg-green-600"
                  } px-2 py-2 rounded text-white cursor-pointer`}
                >
                  Upload Image
                </div>
                <input
                  disabled={!data.banerLink}
                  type="file"
                  id="banner_image"
                  name="image"
                  onChange={handleUploadBrandImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Add Banner"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
