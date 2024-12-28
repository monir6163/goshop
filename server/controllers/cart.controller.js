import CartProduct from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

//add to cart
export async function addToCart(req, res) {
  try {
    const id = req?.userId;
    const { productId } = req.body;
    if (!id)
      return res.status(401).json({
        message: "Please Login First",
        success: false,
        data: null,
        error: true,
      });
    if (!productId)
      return res.status(400).json({
        message: "Product Id is required",
        success: false,
        data: null,
        error: true,
      });

    //check if product already in cart
    const productInCart = await CartProduct.findOne({
      product_id: productId,
      user_id: id,
    });
    if (productInCart)
      return res.status(400).json({
        message: "Product already in cart",
        success: false,
        data: null,
        error: true,
      });

    const cartItem = new CartProduct({
      product_id: productId,
      qty: 1,
      user_id: id,
    });
    const savedCartItem = await cartItem.save();
    const updateCartUserModel = await UserModel.findByIdAndUpdate(id, {
      $push: { shopping_cart: savedCartItem._id },
    });
    return res.status(201).json({
      message: "Product added to cart",
      success: true,
      data: savedCartItem,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      data: null,
      error: true,
    });
  }
}

//get cart items
export async function getCartItems(req, res) {
  try {
    const id = req?.userId;
    if (!id)
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        data: null,
        error: true,
      });
    const cartItems = await CartProduct.find({ user_id: id })
      .populate("product_id")
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({
      message: "Cart Items",
      success: true,
      data: cartItems,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      data: null,
      error: true,
    });
  }
}

//update cart item
export async function updateCartItem(req, res) {
  try {
    const id = req?.userId;
    const { cartId, qty } = req.body;
    if (!id)
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        data: null,
        error: true,
      });
    if (!cartId || !qty)
      return res.status(400).json({
        message: "Cart Id and qty is required",
        success: false,
        data: null,
        error: true,
      });
    const updatedCartItem = await CartProduct.findByIdAndUpdate(cartId, {
      qty,
    });
    return res.status(200).json({
      message: "Cart Item updated",
      success: true,
      data: updatedCartItem,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      data: null,
      error: true,
    });
  }
}

//delete cart item
export async function deleteCartItem(req, res) {
  try {
    const id = req?.userId;
    const { id: cartId } = req.params;
    if (!id)
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        data: null,
        error: true,
      });
    if (!cartId)
      return res.status(400).json({
        message: "Cart Id is required",
        success: false,
        data: null,
        error: true,
      });
    const deletedCartItem = await CartProduct.findByIdAndDelete(cartId);
    const updateCartUserModel = await UserModel.findByIdAndUpdate(id, {
      $pull: { shopping_cart: cartId },
    });
    return res.status(200).json({
      message: "Cart Item deleted",
      success: true,
      data: deletedCartItem,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      data: null,
      error: true,
    });
  }
}
