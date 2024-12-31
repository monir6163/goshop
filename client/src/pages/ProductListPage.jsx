/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import CardProduct from "../components/CardProduct";
import Loading from "../utils/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import CardLoading from "../components/CardLoading";

export default function ProductListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const params = useParams();
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  const category_id = params?.category?.split("-")?.slice(-1)[0];
  const subcategory_id = params?.subcategory?.split("-")?.slice(-1)[0];
  const subCatName = params?.subcategory?.split("-")?.slice(0, -1).join(" ");

  const fetchProductsData = async (currentPage = 1, sort = "newest") => {
    try {
      setLoading(true);
      const res = await Axios({
        ...apiSummary.getProductByCategoryAndSubCat,
        data: {
          category_id: category_id,
          subcategory_id: subcategory_id,
          page: currentPage,
          limit: 10,
          sortBy: sort,
        },
      });
      if (res.data.success) {
        if (currentPage === 1) {
          setData(res.data.data);
        } else {
          setData((prevData) => [...prevData, ...res.data.data]);
        }
        setTotalPages(res?.data?.page);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    fetchProductsData(1, sortBy);

    // Filter subcategories based on the category
    const subCat = allSubCategory?.filter((sub) =>
      sub?.category_id?.some((c) => c?._id === category_id)
    );
    setDisplaySubCategory(subCat);
  }, [params, allSubCategory, sortBy]);

  const fetchDataNextPage = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProductsData(nextPage);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // Update sort state
    setPage(1); // Reset to the first page when sorting changes
  };

  // Scroll to the top when params change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [params]);

  return (
    <section className="sticky top-24 lg:top-20 bg-white">
      <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[210px,1fr]">
        {/* Sidebar subcategory scroll list */}
        <div className="bg-white mb-1 overflow-y-scroll shadow min-h-[79vh] max-h-[79vh]">
          {displaySubCategory?.map((sub, i) => {
            const url = `/cn/${sub?.category_id[0]?.slug}-${sub?.category_id[0]?._id}/${sub?.slug}-${sub?._id}`;
            return (
              <Link
                to={url}
                key={i}
                className={`relative p-3 flex justify-center md:justify-between lg:justify-between items-center gap-3 border-r border-b border-gray-200 cursor-pointer hover:bg-green-100 transition-all ${
                  subcategory_id === sub?._id
                    ? "bg-green-100 border-l-4 rounded  border-l-green-600"
                    : ""
                }`}
              >
                <div className="flex flex-col md:flex-row lg:flex-row items-center gap-2 lg:gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-green-100">
                    <img
                      src={sub?.image}
                      alt={sub?.name}
                      className="relative top-2 w-full transform scale-95"
                    />
                  </div>
                  <div className="text-gray-900 text-sm font-medium text-wrap text-center md:text-start lg:text-start">
                    {sub?.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Product list */}
        <div>
          <div className="bg-white shadow-md p-4 flex gap-2 flex-col lg:flex-row lg:justify-between">
            <h3 className="capitalize text-sm font-medium md:font-semibold">
              {subCatName === "undefined" ? "No Sub Category" : subCatName}
            </h3>
            <div className="flex gap-2 items-center">
            <div className="text-gray-500 hidden lg:block text-sm font-medium">Sort by:</div>
              <select
                name="sort"
                id="sort"
                className="border text-green-900 border-gray-300 p-1 rounded text-sm outline-none focus-within:outline-none"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Newest (New to Old)</option>
                <option value="discount">Discount (High to Low)</option>
                <option value="priceLowToHigh">Price (Low to High)</option>
                <option value="priceHighToLow">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="name">Name (A to Z)</option>
              </select>
          </div>
          </div>
          {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loading />
              </div>
            )}
          <InfiniteScroll
            dataLength={data?.length}
            next={fetchDataNextPage}
            hasMore={page < totalPages}
            loader={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {new Array(10).fill(null).map((_, index) => (
                  <CardLoading key={`loading-${index}`} />
                ))}
              </div>
            }
            endMessage={
              data?.length > 0 ? (
                <p className="text-center font-semibold py-2">
                  No more products
                </p>
              ) : (
                <p className="text-center font-semibold py-2"></p>
              )
            }
          >
            <div className="grid grid-cols-1 bg-[#f4f6fb] p-2 overflow-hidden py-3 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {!loading && data.length === 0 && (
                <div className="text-center text-gray-600 col-span-full">
                  No products in this category or subcategory
                </div>
              )}
              {data?.map((p, i) => (
                <CardProduct key={i} data={p} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </section>
  );
}
