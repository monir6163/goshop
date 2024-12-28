import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

export default function MyOrder() {
  const {allOrders} = useGlobalContext();
  return <div className="p-4">
     <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">My Orders</h2>
      </div>
      {
          allOrders?.map((order,index)=>{
            return(
              <div key={order._id+index+"order"} className='rounded p-4 text-sm shadow-md my-4 bg-green-100'>
                  <p className="my-2">Order No : {order?.order_id}</p>
                  <p className="my-2 capitalize">Payment Status : {order?.payment_status}</p>
                  <p className="my-2 capitalize">Payment Type : {order?.payment_type}</p>
                  <p className="my-2">Total Amount : {DisplayPriceInRupees(order?.total_amount)}</p>
                  <p className="my-2">Sub Total Amount : {DisplayPriceInRupees(order?.sub_total_amount)}</p>
                  <p className="my-2">Order Date : {new Date(order?.createdAt).toLocaleDateString()}</p>
                  <p className="my-2">Payment Id : {order?.payment_id}</p>
                  <p className="my-2">Phone : {order?.delivary_address?.phone}</p>
                  <p className="my-2">Delivary Address : {order?.delivary_address?.address_line}, {order?.delivary_address?.city} , {
                    order?.delivary_address?.state} , {order?.delivary_address?.pincode} , {order?.delivary_address?.country
                    }                  </p>
                  <div className='flex flex-col w-full gap-3'>
                    {
                      order?.products?.map((product,index)=>{
                        return(
                          <div key={product._id+index+"product"} className='product flex gap-3'>
                            <img src={product?.product_details?.image[0]} alt={product?.product_details?.name} className='w-16 h-16 object-cover'/>
                            <div>
                              <p>{product?.product_details?.name}</p>
                              <p>Qty : {product?.qty}</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
              </div>
            )
          })
        }
  </div>;
}
