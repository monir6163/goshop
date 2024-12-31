import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import AddressModal from "../components/AddressModal";
import AlertBox from "../components/AlertBox";
import { useGlobalContext } from "../provider/GlobalProvider";
import { axiosToastError } from "../utils/axiosToastError";

export default function Address() {
  const { addressList, fetchAddressData } = useGlobalContext();
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteAddress, setDeleteAddress] = useState(false);

  const handleDeleteAddress = async (id) => {
    try {
      const { data: res } = await Axios({
        ...apiSummary.deleteAddress,
        url: apiSummary.deleteAddress.url.replace(":id", id),
      });
      if (res?.success) {
        fetchAddressData();
        toast.success(res?.message);
        setDeleteAddress(false);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  return (
    <div>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Delivery Address</h2>
      </div>
      <div className="p-4 grid gap-4 rounded">
        {addressList?.map((address, i) => {
          return (
            <div
              key={i}
              className={`rounded border border-slate-300 p-4 hover:border-green-500 transition-all hover:shadow-md
          flex items-center gap-4 hover:bg-green-50
              ${address?.status === false && "hidden"}
          `}
            >
              <div className="w-full">
                <p className="font-semibold">{address?.address_line}</p>
                <p>{address?.city}</p>
                <p>{address?.state}</p>
                <p></p>
                <p>
                  {address?.country} - ({address?.pincode})
                </p>
                <p>{address?.phone}</p>
              </div>
              {/* edit , delete */}
              <div className="px-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setEditAddress(true);
                    setEditData(address);
                  }}
                  className="text-blue-500 p-1 bg-yellow-400 rounded hover:bg-yellow-500 hover:text-white"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => {
                    setDeleteAddress(true);
                    setEditData(address);
                  }}
                  className="text-red-500 p-1 bg-red-400 rounded hover:bg-red-500 hover:text-white"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddressModal(true)}
          className="bg-blue-50 h-12 border border-blue-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-100"
        >
          Add new address
        </div>
      </div>
      {/* <AddressModal /> */}
      {openAddressModal && (
        <AddressModal close={() => setOpenAddressModal(false)} />
      )}
      {editAddress && (
        <AddressModal
          mode={"edit"}
          close={() => setEditAddress(false)}
          editData={editData}
        />
      )}
      {deleteAddress && (
        <AlertBox
          close={() => setDeleteAddress(false)}
          confirm={() => handleDeleteAddress(editData?._id)}
          cancel={() => setDeleteAddress(false)}
        />
      )}
    </div>
  );
}
