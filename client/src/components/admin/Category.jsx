/* eslint-disable react-hooks/exhaustive-deps */
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { axiosToastError } from "../../utils/axiosToastError";
import LoadingSpinner from "../../utils/LoadingSpinner";
import AlertBox from "../AlertBox";
import EditCategory from "./EditCategory";
import UploadCatModal from "./UploadCatModal";

export default function Category() {
  const [openCatModal, setOpenCatModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getCategoryAdmin,
        url:`${apiSummary.getCategoryAdmin.url}?page=${page}&search=${search}&limit=${12}`
      });
      if (data.success) {
        setCategories(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [page]);

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
        fetchCategories();
        flag = false;
      }
    }, 300);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  const deleteCategory = async (id) => {
    try {
      const { data } = await Axios({
        ...apiSummary.deleteCategory,
        url: apiSummary.deleteCategory.url.replace(":id", id),
      });

      if (data.success) {
        toast.success(data.message);
        setDeleteAlert(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error || "Failed to delete category");
    }
  };

  const handleCheck = async (id, currentChecked) => {
    try {
      const { data } = await Axios({
        ...apiSummary.updateCategoryShowOnHome,
        data: { id, showOnHome: !currentChecked },
      });
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  // top scroll
 
  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        {/* search category */}
        <input
          type="text"
          placeholder="Search Category"
          className="border p-1 rounded"
          value={search}
          onChange={handleSearch}
        />
        <button
          onClick={() => setOpenCatModal(true)}
          className="text-sm border flex gap-2 items-center border-green-200 hover:bg-green-600 px-3 py-1 rounded hover:text-white"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>
      {!categories[0] && (
        <div className="p-4 bg-white shadow-md mt-2">
          <p className="text-center font-semibold">No Category Found</p>
        </div>
      )}
      {/* {categories?.length === 0 && <LoadingSpinner />} */}
      <div className="py-2 lg:m-2 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {categories?.map((cat, i) => (
          <div key={i} className="bg-[#edf4ff] shadow-md border rounded-lg">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full object-scale-down rounded-lg"
            />
            <div className="py-1 px-1 text-center">
              <p className="text-sm text-neutral-600 mb-2">{cat.name}</p>
              <div className="flex justify-evenly my-1">
                <input
                  type="checkbox"
                  title="Show on home"
                  onChange={() => handleCheck(cat._id, cat.showOnHome)}
                  checked={cat?.showOnHome === true}
                />
                <button
                  onClick={() => {
                    setDeleteAlert(true);
                    setEditData(cat);
                  }}
                  className="text-sm bg-red-600 text-white p-1 rounded"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(cat);
                  }}
                  className="text-sm bg-yellow-500 p-1 text-white rounded"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {categories.length > 0 && <div className="flex justify-between my-4 px-2">
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

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchCategories={fetchCategories}
        />
      )}
      {openCatModal && (
        <UploadCatModal
          fetchCategories={fetchCategories}
          close={() => setOpenCatModal(false)}
        />
      )}
      {deleteAlert && (
        <AlertBox
          close={() => setDeleteAlert(false)}
          confirm={() => deleteCategory(editData._id)}
          cancel={() => setDeleteAlert(false)}
        />
      )}
    </>
  );
}
