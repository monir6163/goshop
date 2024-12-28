import { BsCart4 } from "react-icons/bs";
import { FaCaretRight } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

export default function MobileCart() {
  const { toatalPric, totalQty, cartItem } = useGlobalContext();
  const pathname = useLocation()?.pathname;
  return (
    <>
      {cartItem[0] && (
        <div
          className={`lg:hidden sticky bottom-2 p-1
        ${pathname === "/cart" ? "z-0" : "z-30"}
        `}
        >
          <div className="bg-green-800 px-3 py-2 rounded text-neutral-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="animate-bounce">
                <BsCart4 size={26} />
              </div>
              <div className="font-semibold text-sm">
                {cartItem[0] ? (
                  <div>
                    <p>{totalQty} Items</p>
                    <p>{DisplayPriceInRupees(toatalPric)}</p>
                  </div>
                ) : (
                  <p>My Cart</p>
                )}
              </div>
            </div>
            <Link to={"/cart"}>
              <button className="bg-green-900 hover:bg-green-700 px-3 py-2 rounded text-white w-full flex items-center">
                <span className="text-base leading-3">View Cart</span>
                <FaCaretRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
