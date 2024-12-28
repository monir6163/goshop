import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import Demo from "../../assets/demo.png";
import { axiosToastError } from "../../utils/axiosToastError";
import AlertBox from "../AlertBox";
import BrandTable from "./BrandTable";
import EditBand from "./EditBand";
import UploadBrandModal from "./UploadBrandModal";
import ViewImage from "./ViewImage";

export default function ProductBrand() {
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [openEditBrandModal, setOpenEditBrandModal] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editData, setEditData] = useState({});
  const [brands, setBrands] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const columnHelper = createColumnHelper();
  const allBrand = useSelector((state) => state.product.allBrand);
  const fetchBrands = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getBrands,
      });
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  useEffect(() => {
    setBrands(allBrand);
    fetchBrands();
  }, [allBrand]);

  const handleDelete = async (id) => {
    try {
      const { data } = await Axios({
        ...apiSummary.deleteBrand,
        url: apiSummary.deleteBrand.url.replace(":id", id),
        method: "DELETE",
      });
      if (data.success) {
        toast.success(data.message);
        fetchBrands();
        setDeleteAlert(false);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  const column = [
    columnHelper.accessor("name", {
      header: () => <span>Brand Name</span>,
    }),
    columnHelper.accessor("image", {
      header: () => <span>Image</span>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={row.original.image || Demo}
              alt={row.original.name}
              className="w-8 h-8 rounded-full  cursor-pointer"
              onClick={() => setImageUrl(row.original.image)}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: () => <span>Action</span>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-center">
            <button className="bg-green-500 p-1 text-white rounded hover:bg-green-600">
              <AiFillLike size={16} />
            </button>
            <button
              onClick={() => {
                setEditData(row.original);
                setOpenEditBrandModal(true);
              }}
              className="bg-yellow-500 p-1 text-white rounded hover:bg-yellow-600"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => {
                setDeleteAlert(true);
                setEditData(row.original);
              }}
              className="bg-red-500 p-1 text-white rounded hover:bg-red-600"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      },
    }),
  ];
  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Product Brand</h2>
        <button
          onClick={() => setOpenBrandModal(true)}
          className="text-sm border flex gap-2 items-center border-green-200 hover:bg-green-600 px-3 py-1 rounded hover:text-white"
        >
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[95vw]">
        {<BrandTable column={column} data={brands} />}
      </div>

      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl("")} />}

      {openBrandModal && (
        <UploadBrandModal
          close={() => setOpenBrandModal(false)}
          fetchBrands={fetchBrands}
        />
      )}

      {openEditBrandModal && (
        <EditBand
          close={() => setOpenEditBrandModal(false)}
          data={editData}
          fetchBrands={fetchBrands}
        />
      )}

      {deleteAlert && (
        <AlertBox
          close={() => setDeleteAlert(false)}
          confirm={() => handleDelete(editData._id)}
          cancel={() => setDeleteAlert(false)}
        />
      )}
    </>
  );
}
