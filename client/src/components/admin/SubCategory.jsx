/* eslint-disable react-hooks/exhaustive-deps */
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { axiosToastError } from "../../utils/axiosToastError";
import AlertBox from "../AlertBox";
import DisplayTable from "./DisplayTable";
import EditSubCategory from "./EditSubCategory";
import UploadSubCatModal from "./UploadSubCatModal";
import ViewImage from "./ViewImage";
import LoadingSpinner from "../../utils/LoadingSpinner";
export default function SubCategory() {
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteAlert, setDeleteAlert] = useState(false);
  const columnHelper = createColumnHelper();
  const allCategory = useSelector((state) => state.product.allCategory);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 12;
  const fetchSubCategories = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getSubCatAdmin,
        url:`${apiSummary.getSubCatAdmin.url}?page=${page}&search=${search}&limit=${limit}`
      });
      if (data.success) {
        setSubCategories(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      axiosToastError(error)
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    setCategories(allCategory);
    fetchSubCategories();
  }, [allCategory, page]);


  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
    
  };
  const handleNext = () => {
    if (page !== totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = async (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchSubCategories()
        flag = false;
      }
    }, 300);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);


  const handleDelete = async (id) => {
    try {
      const { data } = await Axios({
        ...apiSummary.deleteSubCategory,
        url: apiSummary.deleteSubCategory.url.replace(":id", id),
        method: "DELETE",
      });
      if (data.success) {
        toast.success(data.message);
        fetchSubCategories();
        setDeleteAlert(false);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  const column = [
    columnHelper.accessor("name", {
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor("image", {
      header: () => <span>Image</span>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 rounded-full  cursor-pointer"
              onClick={() => setImageUrl(row.original.image)}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category_id", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <span>
            {row?.original?.category_id?.map((cat) => cat?.name).join(", ")}
          </span>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        // console.log(row.original);
        return (
          <>
            <div className="flex items-center gap-2">
              <button className="bg-green-500 p-1 rounded text-white hover:bg-green-600">
                <AiFillLike size={14} />
              </button>
              <button
                onClick={() => {
                  setOpenEditModal(true);
                  setEditData(row.original);
                }}
                className="bg-yellow-500 p-1 rounded text-white hover:bg-yellow-600"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  setDeleteAlert(true);
                  setEditData(row.original);
                }}
                className="bg-red-500 p-1 rounded text-white hover:bg-red-600"
              >
                <Trash size={14} />
              </button>
            </div>
          </>
        );
      },
    }),
  ];



  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">SubCategory</h2>
        {/* search category */}
        <input
          type="text"
          placeholder="Search SubCategory"
          className="border p-1 rounded"
          value={search}
          onChange={handleSearch}
        />
        <button
          onClick={() => setOpenSubCategory(true)}
          className="text-sm border flex gap-2 items-center border-green-200 hover:bg-green-600 px-3 py-1 rounded hover:text-white"
        >
          <Plus size={16} /> Add SubCategory
        </button>
      </div>

      {!subCategories[0] && (
        <div className="p-4 bg-white shadow-md mt-2">
          <p className="text-center font-semibold">No Category Found</p>
        </div>
      )}

      <div className="overflow-auto w-full max-w-[95vw]">
        {<DisplayTable data={subCategories} column={column} page={page} limit={limit}/>}
      </div>
      {subCategories.length > 0 && <div className="flex justify-between my-4 px-2">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Previous
          </button>
          <button className=" bg-slate-100">
            {page}/{totalPages}
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Next
          </button>
        </div>}




      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl("")} />}

      {openSubCategory && (
        <UploadSubCatModal
          close={() => setOpenSubCategory(false)}
          categories={categories}
          fetchSubCategories={fetchSubCategories}
        />
      )}
      {openEditModal && (
        <EditSubCategory
          close={() => setOpenEditModal(false)}
          editData={editData}
          categories={categories}
          fetchSubCategories={fetchSubCategories}
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
