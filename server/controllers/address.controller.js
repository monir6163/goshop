import Address from "../models/address.model.js";
import UserModel from "../models/user.model.js";

// store address
export async function storeAddress(req, res) {
  try {
    const id = req?.userId;
    const { address_line, city, state, pincode, country, phone } = req.body;
    // validate
    if (!address_line || !city || !state || !pincode || !country || !phone) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        data: null,
        error: true,
      });
    }
    const address = new Address({
      address_line,
      city,
      state,
      pincode,
      country,
      phone,
      userId: id,
    });
    const createdAddress = await address.save();
    await UserModel.findByIdAndUpdate(
      id,
      { $push: { address_details: createdAddress._id } },
      { new: true }
    );
    return res.status(201).json({
      message: "Address created successfully",
      success: true,
      data: createdAddress,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      data: null,
      error: true,
    });
  }
}

// get all address
export async function getAllAddress(req, res) {
  try {
    const id = req?.userId;
    const address = await Address.find({
      userId: id,
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All address",
      success: true,
      data: address,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      data: null,
      error: true,
    });
  }
}

// update address
export async function updateAddress(req, res) {
  try {
    const { _id, address_line, city, state, pincode, country, phone } =
      req.body;
    // validate
    if (
      !_id ||
      !address_line ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !phone
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        data: null,
        error: true,
      });
    }
    const address = await Address.findByIdAndUpdate(
      _id,
      {
        address_line,
        city,
        state,
        pincode,
        country,
        phone,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
      data: address,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      data: null,
      error: true,
    });
  }
}

// delete address
export async function deleteAddress(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Id is required",
        success: false,
        data: null,
        error: true,
      });
    }
    await Address.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Address deleted successfully",
      success: true,
      data: null,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      data: null,
      error: true,
    });
  }
}
