import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { axiosToastError } from "../../utils/axiosToastError";
import EditProduct from "./EditProduct";

/* eslint-disable react/prop-types */
const ProductCard = ({ data, fetchProducts }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteProduct = async (id) => {
    try {
      const { data } = await Axios({
        ...apiSummary.deleteProduct,
        url: apiSummary.deleteProduct.url.replace(":id", id),
      });
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setOpenDelete(false);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  return (
    <div className="bg-[#edf4ff] shadow-md border rounded-lg">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full object-scale-down rounded-lg"
        />
      </div>

      <div className="py-1 px-1 text-center">
        <p className="text-sm text-ellipsis line-clamp-1 text-neutral-600 mb-2">
          {data?.name}
        </p>
        <p className="text-slate-400 text-sm">{data?.unit}</p>
        <div className="flex justify-evenly my-1">
          <button
            onClick={() => {
              setOpenDelete(true);
            }}
            className="text-sm bg-red-600 text-white p-1 rounded"
          >
            <Trash size={16} />
          </button>
          <button
            onClick={() => {
              setEditOpen(true);
            }}
            className="text-sm bg-yellow-500 p-1 text-white rounded"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>

      {editOpen && (
        <EditProduct
          fetchProducts={fetchProducts}
          pdata={data}
          close={() => setEditOpen(false)}
        />
      )}

      {openDelete && (
        <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center ">
          <div className="bg-white p-4 w-full max-w-md rounded-md">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">Permanent Delete</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-2">Are you sure want to delete permanent ?</p>
            <div className="flex justify-end gap-5 py-4">
              <button
                onClick={() => setOpenDelete(false)}
                className="border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(data._id)}
                className="border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCard;
