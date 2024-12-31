/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { Trash } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import OrderTable from "../components/admin/OrderTable";
import { Axios } from "../api/axios";
import apiSummary from "../api/api";
import { setOrdersByAdmin } from "../redux/addressSlice";
import LoadingSpinner from "../utils/LoadingSpinner";
import { axiosToastError } from "../utils/axiosToastError";
import toast from "react-hot-toast";
import ViewOrderModal from "../components/admin/ViewOrderModal";

const columnHelper = createColumnHelper();

export default function OrderManage() {
  const orderData = useSelector((state) => state?.address?.ordersByAdmin);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true); // Main loader
  const [isLoadingFilter, setIsLoadingFilter] = useState(false); // Filter/Pagination loader
  const limit = 12;

  const fetchAllOrdersAdmin = async (isFilterAction = false) => {
    try {
      if (isFilterAction) setIsLoadingFilter(true);
      else setLoading(true);

      const { data } = await Axios({
        ...apiSummary.getAllOrdersByAdmin,
        url: `${apiSummary.getAllOrdersByAdmin.url}?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
      });

      setTotalPages(data.totalPages);
      dispatch(setOrdersByAdmin(data?.data));
    } catch (error) {
      axiosToastError(error);
    } finally {
      if (isFilterAction) setIsLoadingFilter(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrdersAdmin();
  }, [page]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchAllOrdersAdmin(true); // Loader for search
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [search]);

  const handleFilter = (e) => {
    const { value } = e.target;
    setFilter(value);
    setPage(1);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchAllOrdersAdmin(true); // Loader for filter
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [filter]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

const handleOrderStatus = async (id,status) => {
  try {
    const { data:update } = await Axios({
      ...apiSummary.updateOrderStatus,
      data: { orderId: id, status },
    });
    if (update.success) {
      toast.success(update.message);
      fetchAllOrdersAdmin();
    }
  } catch (error) {
    axiosToastError(error);
  }
}

  const column = [
    columnHelper.accessor("order_id", { header: "Order ID" }),
    columnHelper.accessor("payment_status", { header: "Payment Status", cell: ({ row }) => (
      <>
      {row.original.payment_type === "Cash on delivery" ? (
        <select className="border p-1 rounded text-sm"
        value={row.original.payment_status} // Controlled value
            onChange={(e) =>
              handleOrderStatus(row.original.order_id, e.target.value) // Trigger API call directly
            }>
          {/* default showing payment status */}
          <option value="pending" selected={row.original.payment_status === "pending"}>Pending</option>
          <option value='confirmed' selected={row.original.payment_status === "confirmed"}>Confirmed</option>
          <option value='processing' selected={row.original.payment_status === "processing"}>Processing</option>
          <option value='dispatched' selected={row.original.payment_status === "dispatched"}>Dispatched</option>
          <option value='delivered' selected={row.original.payment_status === "delivered"}>Delivered</option>
          <option value='cancelled' selected={row.original.payment_status === "cancelled"}>Cancelled</option>

      </select>
      ):(
        row.original.payment_status === "paid" && <span className="text-green-500">Paid</span>
      )}
      </>
    )}),
    columnHelper.accessor("payment_type", { header: "Payment Type" }),
    columnHelper.accessor("createdAt", {
      header: "Order Date",
      cell: ({ row }) => (
        <p>{moment(row.original.createdAt).format("DD-MM-YYYY")}</p>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
          onClick={() => {
            setViewOrder(row.original);
            setOpenModal(true);
          }}
          className="bg-green-500 p-1 rounded text-white hover:bg-green-600">
            <FaEye size={14} />
          </button>
          <button className="bg-red-500 p-1 rounded text-white hover:bg-red-600">
            <Trash size={14} />
          </button>
        </div>
      ),
    }),
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="p-2 bg-white shadow-md flex gap-2 lg:items-center flex-col lg:flex-row lg:justify-between">
        <h2 className="font-semibold">All Orders</h2>
        <input
          type="text"
          placeholder="Search Orders"
          className="border p-1 rounded"
          value={search}
          onChange={handleSearch}
        />
        <select
          className="border p-1 rounded text-sm"
          value={filter}
          onChange={handleFilter}
        >
          <option value="">All</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {isLoadingFilter && <LoadingSpinner />} {/* Loader for Filter or Pagination */}

      {!orderData.length && !isLoadingFilter && (
        <div className="p-4 bg-white shadow-md mt-2">
          <p className="text-center font-semibold">No Orders Found</p>
        </div>
      )}

      <div className="overflow-auto w-full max-w-[95vw]">
        <OrderTable data={orderData} column={column} page={page} limit={limit} />
      </div>

      {orderData.length > 0 && (
        <div className="flex justify-between my-4 px-2">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Previous
          </button>
          <button className="bg-slate-100">{page}/{totalPages}</button>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Next
          </button>
        </div>
      )}

      {
        openModal && (
          <ViewOrderModal close={() => setOpenModal(false)} order={viewOrder} />
        )
      }
    </>
  );
}
