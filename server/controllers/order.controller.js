import mongoose from "mongoose";
import moment from "moment-timezone";
import CartProduct from "../models/cartProduct.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import stripe from "../config/stripe.js";
import sendMail from "../config/node.mailer.js";
export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

// cash on delivery
export const createCashOrder = async (req, res) => {
  try {
    const userId = req?.userId;
    const { list_items, totalAmount, addressId, subTotalAmount } = req.body;

    if (!addressId) {
      return res.status(400).json({
        message: "Please provide address",
        error: true,
        data: null,
        success: false,
      });
    }

    const orderPayload = {
      user_id: userId,
      order_id: `ORD-${new mongoose.Types.ObjectId()}`,
      products: list_items.map((item) => ({
        product_id: item?.product_id._id,
        product_details: {
          name: item?.product_id?.name,
          image: item?.product_id?.image,
        },
        qty: item?.qty,
      })),
      payment_type: "Cash on delivery",
      payment_status: "Pending",
      delivary_address: addressId,
      sub_total_amount: subTotalAmount,
      total_amount: totalAmount,
    };

    const newOrder = await Order.create(orderPayload);
    // update user model orderHistory
    await UserModel.updateOne({ _id: userId }, { $push: { orderHistory: newOrder._id } });
    // Update product stock
    await Promise.all(
      list_items.map(async (item) => {
        const product = await Product.findById(item?.product_id);
        product.stock -= item?.qty;
        await product.save();
      })
    );

    // Clear user cart
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
    await CartProduct.deleteMany({ user_id: userId });

    const user = await UserModel.findOne({ _id: userId});
    // Send invoice
    await sendMail({
      sendTo: user?.email,
      subject: "Order Confirmation",
      html: `
      <h1>Order Confirmation</h1>
      <p>Order ID: ${newOrder.order_id}</p>
      <p>Date: ${moment(newOrder.createdAt).format("DD-MM-YYYY")}</p>
      <table>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${list_items
          .map(
            (item) => `
          <tr>
            <td>${item.product_id.name}</td>
            <td>${item.qty}</td>
            <td>$${pricewithDiscount(item.product_id.price, item.product_id.discount)}</td>
            <td>$${pricewithDiscount(item.product_id.price, item.product_id.discount) * item.qty}</td>
          </tr>
        `
          )
          .join("")}
      </table>
      <h3>Total: $${totalAmount}</h3>
      <p>Thank you for your purchase! If you have any questions, contact us at ${process.env.AUTH_EMAIL}.</p>
      `,
    });

    return res.status(200).json({
      message: "Order created successfully",
      error: false,
      data: newOrder,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to create order",
      error: true,
      data: null,
      success: false,
    });
  }
};


// stripe payment
export const createStripeOrder = async (req, res) => {
  try {
    const userId = req?.userId;
    const user = await UserModel.findById(userId);
    const { list_items, totalAmount, addressId, subTotalAmount } = req.body;
    if (!addressId) {
      return res.status(400).json({
        message: "Please provide address",
        error: true,
        data: null,
        success: false,
      });
    }
    const payload = list_items?.map((item) => {
      return {
        price_data:{
          currency: 'USD',
          product_data:{
            name:item.product_id.name,
            images:item.product_id.image,
            // stock:item.product_id.stock,
            metadata:{
              product_id:item.product_id._id
            }
          },
          unit_amount: pricewithDiscount(item.product_id.price, item.product_id.discount)*100
        },
        adjustable_quantity:{
          enabled:true,
          minimum:1
        }, 
        quantity:item.qty
      };
    });

    const params = {
      submit_type:"pay",
      mode:'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata : {
        userId : userId.toString(),
        addressId : addressId
    },
      line_items:payload,
      success_url: `${process.env.FRONTEND_URL}/order-success`,
      cancel_url: `${process.env.FRONTEND_URL}/order-cancel`,
    }

    const session = await stripe.checkout.sessions.create(params)
    return res.status(200).json(session)
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to create order",
      error: true,
      data: null,
      success: false,
    });
  }
};

// stripe payment webhook
export const stripeWebHook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    // console.log("webhook", sig);
    const webhookSecret = process.env.STRIPE_WEBHOOK;

    let event = req.body;
    // console.log("Webhook received", req.body);
    // event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    // console.log("Webhook verified", event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const userId = session.metadata.userId;
        const addressId = session.metadata.addressId;
        const orderItems = await getOrderItems({
          lineItems: lineItems,
          userId: userId,
          addressId: session.metadata.addressId,
          payment_id: session.payment_intent,
          payment_type: session.payment_method_types[0],
          payment_status: session.payment_status,
          sub_total_amount: session.amount_subtotal,
          total_amount: session.amount_total
        });
        const orderPayload = {
          user_id: userId,
          order_id: `ORD-${new mongoose.Types.ObjectId()}`,
          products: orderItems?.map((item) => ({
            product_id: item.product_id,
            product_details: item.product_details,
            qty: item.qty,
          })),
          payment_id: session.payment_intent,
          payment_type: session.payment_method_types[0],
          payment_status: session.payment_status,
          delivary_address: addressId,
          sub_total_amount: session.amount_subtotal / 100,
          total_amount: session.amount_total / 100,

        };
    
        const newOrder = await Order.create(orderPayload);
        // console.log(newOrder);
        if (newOrder) {
          const updateProductStock = await Promise.all(
            orderItems?.map(async (item) => {
              const product = await Product.findById(item.product_id);
              product.stock -= item.qty;
              await product.save();
            }
          ));
          await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
          await CartProduct.deleteMany({ user_id: userId });
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod', paymentMethod);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("webhook error", error.message);
    res.status(500).json({
      message: error.message || "Payment Failed",
      error: true,
      data: null,
      success: false,
    });
  }
};


// getorderitems function
const getOrderItems = async ({
  lineItems,
  userId,
  addressId,
  payment_id,
  payment_type,
  payment_status,
  sub_total_amount,
  total_amount,
}) => {
  const productList = [];
  if (lineItems?.data?.length) {
    for (const item of lineItems?.data) {
      
      try {
        const product = await stripe.products.retrieve(item.price.product);
        if (!product.metadata.product_id || !product.name) {
          console.error("Invalid product data:", product);
          continue; // Skip invalid items
        }
        const payload = {
          user_id: userId,
          order_id: `ORD-${new mongoose.Types.ObjectId()}`,
          product_id: product.metadata.product_id,
          product_details: {
            name: product.name,
            image: product.images,
          },
          payment_id: payment_id,
          payment_type: payment_type,
          payment_status: payment_status,
          delivary_address: addressId,
          sub_total_amount: sub_total_amount / 100,
          total_amount: total_amount / 100,
          qty: item.quantity
        };
        productList.push(payload);
      } catch (error) {
        console.error("Error retrieving product:", error.message);
      }
    }
  }
  return productList;
};

// get all orders by user id
export const getAllOrders = async(req, res) => {
  try {
    const userId = req?.userId;
    const orders = await Order.find({
      user_id: userId,
    }).sort({ createdAt: -1 }).populate("products.product_id").populate("delivary_address");
    return res.status(200).json({
      message: "Orders fetched successfully",
      error: false,
      data: orders,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to get orders",
      error: true,
      data: null,
      success: false,
    });
  }
}

// get all orders by admin pagination, search, filter by date(today, yesterday, week, month) by default today and limit 10 per page

export const getAllOrdersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, filter } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { order_id: { $regex: search, $options: "i" } },
          { payment_type: { $regex: search, $options: "i" } },
          { payment_status: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (filter) {
      const now = moment().tz("Asia/Dhaka").startOf("day");
      let startDate;
      switch (filter) {
        case "today":
          startDate = now;
          break;
        case "yesterday":
          startDate = now.subtract(1, "days");
          break;
        case "week":
          startDate = now.subtract(7, "days");
          break;
        case "month":
          startDate = now.subtract(30, "days");
          break;
        default:
          startDate = null;
          break;
      }
      query = {
        ...query,
        createdAt: {
          $gte: startDate.toDate(),
          $lt: moment().tz("Asia/Dhaka").endOf("day").toDate(),
        },
      };
    }
    const [data, total] = await Promise.all([
      Order.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("products.product_id")
        .populate("delivary_address")
        .populate("user_id", "name email"),
      Order.countDocuments(query),
    ]);
    return res.status(200).json({
      message: "Orders fetched successfully",
      error: false,
      data,
      total,
      totalPages: Math.ceil(total / limit),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to get orders",
      error: true,
      data: null,
      success: false,
    });
  }
};

// order status update by admin only cash on delivery
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log("update order", orderId, status);
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        data: null,
        success: false,
      });
    }
    if (order.payment_type === "Cash on delivery") {
      order.payment_status = status;
      await order.save();
      return res.status(200).json({
        message: "Order status updated successfully",
        error: false,
        data: order,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Order status can't be updated",
        error: true,
        data: null,
        success: false,
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update order status",
      error: true,
      data: null,
      success: false,
    });
  }
}

// order details by order id
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.query;
    const order = await Order.findOne({ order_id: orderId }).populate("products.product_id").populate("delivary_address").populate("user_id", "name email");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        data: null,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Order details fetched successfully",
      error: false,
      data: order,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to get order details",
      error: true,
      data: null,
      success: false,
    });
  }
};



