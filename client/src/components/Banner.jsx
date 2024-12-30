import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
export default function Banner() {
  const bannerData = useSelector((state) => state?.product?.banner);
  return (
    <section className="container mx-auto">
      <div
        className={`w-full h-full min-h-48 rounded bg-green-200 ${
          !bannerData.length && "animate-pulse my-2"
        }`}
      >
        {bannerData?.map((item, i) => (
          <div key={i}>
            {item?.imgType === "desktop" && (
              <Link to={item?.banerLink}>
                <img
                src={item?.image}
                alt="Banner"
                className="w-full h-full object-cover hidden lg:block"
              />
              </Link>
            )}
            {item?.imgType === "mobile" && (
              <Link to={item?.banerLink}>
                <img
                src={item?.image}
                alt="Banner"
                className="w-full h-full object-cover block lg:hidden"
              />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
