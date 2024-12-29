/* eslint-disable react-hooks/exhaustive-deps */
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import CardLoading from "../components/CardLoading";
import CardProduct from "../components/CardProduct";
import { axiosToastError } from "../utils/axiosToastError";

export default function SearchPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation()?.search;
  const search = new URLSearchParams(params).get("q") || "";
  const loadingArrayCard = new Array(10).fill(null);

  const searchProduct = useCallback(async () => {
    if (!search.trim() && page === 1) {
      try {
        setLoading(true);
        const { data: res } = await Axios({
          ...apiSummary.searchProduct,
          url: `${apiSummary.searchProduct.url}?page=${page}&limit=10`,
        });

        if (res?.success) {
          setData(res.data);
          setTotalPage(res.totalPage);
        }
      } catch (error) {
        axiosToastError(error)
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const { data: res } = await Axios({
        ...apiSummary.searchProduct,
        url: `${apiSummary.searchProduct.url}?search=${search}&page=${page}&limit=10`,
      });

      if (res?.success) {
        setData((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setTotalPage(res.totalPage);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Debounced search to avoid frequent API calls
  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(1);
      setData([]);
      searchProduct();
    }, 300),
    [search]
  );

  useEffect(() => {
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [search]);

  useEffect(() => {
    if (page > 1) searchProduct();
  }, [page]);
  const fetchDataNextPage = () => {
    if (page < totalPage && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // top scroll 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section>
      <div className="container mx-auto p-4">
        {initialLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {loadingArrayCard.map((_, index) => (
              <CardLoading key={`loading-${index}`} />
            ))}
          </div>
        ) : (
          <>
            <p className="font-semibold py-2">
              Search Result: ({data?.length})
            </p>
            {data.length === 0 && !loading && (
              <p className="text-center font-semibold py-2">No product found</p>
            )}
            <InfiniteScroll
              dataLength={data?.length}
              next={fetchDataNextPage}
              hasMore={page < totalPage}
              loader={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {loadingArrayCard.map((_, index) => (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {data?.map((product, i) => (
                  <CardProduct key={i} data={product} />
                ))}
                {loading &&
                  loadingArrayCard?.map((_, index) => {
                    return <CardLoading key={index} />;
                  })}
              </div>
            </InfiniteScroll>
          </>
        )}
      </div>
    </section>
  );
}
