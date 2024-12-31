/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";

export default function ViewOrderModal({ close, order }) {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-md max-h-[80vh] p-4 bg-white">
        <button onClick={close} className="w-fit ml-auto block">
          <IoClose size={25} />
        </button>
        <div className="flex gap-4">
          <div>
            <h2 className="font-semibold">Order Details</h2>
            <p className="text-sm">Order ID: {order?.order_id}</p>
            <p className="text-sm">Total Amount: {order?.total_amount}</p>
            <p className="text-sm">
              Sub Total Amount: {order?.sub_total_amount}
            </p>
            <p className="text-sm">Payment Type: {order?.payment_type}</p>
            <p className="text-sm">Payment Status: {order?.payment_status}</p>
            <p className="text-sm">Payment ID: {order.payment_id}</p>
            <p className="text-sm">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Product Details</h2>
            {order?.products?.map((product) => (
              <div key={product._id} className="flex gap-4">
                <img
                  src={product?.product_details?.image[0]}
                  alt="product"
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <p className="text-sm">
                    Name: {product?.product_details?.name}
                  </p>
                  <p className="text-sm">
                    qty: {product?.qty
                    }
                    </p>
                </div>

              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-4">
            <div>
                <h2 className="font-semibold">User Details</h2>
                <p className="text-sm">Name: {order?.user_id?.name}</p>
                <p className="text-sm">Email: {order?.user_id?.email}</p>
            </div>
            <div>
                <h2 className="font-semibold">Billing Details</h2>
                <p className="text-sm">Name: {order?.delivary_address?.address_line}</p>
                <p className="text-sm">City: {order?.delivary_address?.city}</p>
                <p className="text-sm">State: {order?.delivary_address?.state}</p>
                <p className="text-sm">Zip: {order?.delivary_address?.pincode}</p>
                <p className="text-sm">Country: {order?.delivary_address?.country}</p>
                <p className="text-sm">Phone: {order?.delivary_address?.phone}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
