/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { Axios } from "../api/axios";
import apiSummary from "../api/api";
import { axiosToastError } from "../utils/axiosToastError";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CardLoading from "../components/CardLoading";
import CardProduct from "../components/CardProduct";


export default function BrandProducts() {
    const params = useParams();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const brandId = params?.brand?.split("-")?.slice(-1)[0];
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const loadingArrayCard = new Array(10).fill(null);
    const featchBrandProducts = async () => {
        try {
            const { data } = await Axios({
                ...apiSummary.getBrandProducts,
                url: `${apiSummary.getBrandProducts.url}?id=${brandId}&page=${page}&limit=10`,
            });
            setData((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
            setTotalPage(data.totalPage);
        } catch (error) {
            axiosToastError(error);
        }finally{
            setLoading(false);
            setInitialLoading(false);
        }
    };
    useEffect(() => {
        featchBrandProducts();
    }, [params, page]);
    const fetchDataNextPage = () => {
        if (page < totalPage && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
    };
    //top scroll
    useEffect(() => {
        window.scrollTo(0, 0);
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
        ) :
            (
                <>
                <p className="font-semibold py-2">
              {data[0]?.brand_id[0]?.name}: ({data?.length})
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
            )

        }
      </div>
    </section>
  )
}
