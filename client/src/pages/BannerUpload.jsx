import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import BannerModel from "../components/admin/BannerModel";
import { useSelector } from "react-redux";

export default function BannerUpload() {
  const [open, setOpen] = useState(false);
  const bannerData = useSelector((state) => state?.product?.banner);
  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Banner Image</h2>
        <button
          onClick={() => setOpen(true)}
          className="text-sm border flex gap-2 items-center border-green-200 hover:bg-green-600 px-3 py-1 rounded hover:text-white"
        >
          <FaPlus size={16} /> Add/Edit Image
        </button>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {bannerData?.map((item) => (
                <div key={item._id} className="relative">
                    <img src={item.image} alt="banner" className="w-full h-40 object-cover" />
                    <div className="absolute top-0 right-0 bg-green-900 text-white p-1">
                        {item.imgType}
                    </div>
                </div>
            ))}
        </div>


        {open && (
            <BannerModel close={() => setOpen(false)} />
        )}
    </>
  );
}
