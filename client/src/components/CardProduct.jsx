/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${data?.slug}-${data?._id}`;

  return (
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white hover:border-green-500 hover:border-opacity-50 hover:shadow-md transition-all"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data?.thumbnail || data.image[0]}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="flex items-center justify-between gap-1">
        <div className="rounded text-xs w-fit p-[1px] px-2 text-green-800 bg-green-50">
          10 min
        </div>
        <div>
          {Boolean(data.discount) && (
            <p className="text-green-800 bg-green-100 px-2 w-fit text-xs rounded-full">
              {data.discount}% dis
            </p>
          )}
        </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm line-clamp-2">
        {data.name}
      </div>
      <div className="flex justify-between px-2 lg:px-0 text-sm lg:text-base">
        <div className="text-slate-700 text-sm">{data?.unit}</div>
        <div className="text-gray-500 line-through">
          {data.discount ? DisplayPriceInRupees(data.price) : ""}
        </div>
      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex items-center gap-1">
          <div className="text-green-800 font-semibold">
            {data.discount
              ? DisplayPriceInRupees(
                  pricewithDiscount(data.price, data.discount)
                )
              : DisplayPriceInRupees(data.price)}
          </div>
        </div>
        <div className="">
          {data.stock == 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
