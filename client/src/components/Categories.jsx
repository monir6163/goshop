import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeCatProduct from "./HomeCatProduct";

export default function Categories() {
  const loadingCat = useSelector((state) => state.product.loadingCategory);
  const allCategory = useSelector((state) => state.product.allCategory);
  const allCat = useSelector((state) => state.product.allCat);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const handleRedirect = (id, slug) => {
    const subCat = allSubCategory?.find((sub) => {
      const findCat = sub?.category_id.some((c) => {
        return c._id === id;
      });
      return findCat ? true : null;
    });
    const url = `/cn/${slug}-${id}/${subCat?.slug}-${subCat?._id}`;
    navigate(url);
  };
  return (
    <>
      <div className="container mx-auto px-4 my-2 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2">
        {loadingCat ? (
          new Array(12)?.fill(null)?.map((c, i) => {
            return (
              <div
                key={i}
                className="bg-white rounded p-4 min-h-36 grid gap-2 shadow"
              >
                <div className="bg-green-100 min-h-24 rounded"></div>
                <div className="bg-green-100 h-8 rounded"></div>
              </div>
            );
          })
        ) : (
          <>
            {allCategory?.map((cat, i) => {
              return (
                <div
                  key={i}
                  className="border rounded p-[1px] hover:border-green-500 hover:border-opacity-50 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleRedirect(cat._id, cat.slug)}
                >
                  <div className="w-[188.235] h-[128]">
                    <img
                      src={cat?.image}
                      alt={cat?.name}
                      className="w-full h-full object-fill"
                    />
                    <h1 className="text-[12px] py-[2px] px-[2px] text-[#4F4F4F] text-ellipsis line-clamp-1 text-center">
                      {cat?.name}
                    </h1>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      {/* category home product">*/}
      {allCat?.map((cat, i) => (
        <HomeCatProduct
          key={i}
          id={cat?.category_id?._id}
          name={cat?.category_id?.name}
          slug={cat?.category_id?.slug}
        />
      ))}
    </>
  );
}
