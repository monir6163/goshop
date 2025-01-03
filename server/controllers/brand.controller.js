import slugify from "slugify";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
//create brand
export async function createBrand(req, res) {
  try {
    const { name, image, description } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }
    const newBrand = new Brand({
      name,
      slug: slugify(name, {
        trim: true,
        lower: true,
      }),
      description,
      image,
    });
    const data = await newBrand.save();
    return res.status(201).json({
      data,
      message: "Brand created successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// get all brands
export async function getBrands(req, res) {
  try {
    const data = await Brand.find().sort({ name: 1 });
    return res.status(200).json({
      data,
      message: "All brands",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// get all brand admin
export async function getBrandsAdmin(req, res){
  try {
    const {page, limit, search} = req.query;
    if(!page){
      page = 1;
    }
    if(!limit){
      limit = 12;
    }
    const skip = (page-1)*limit;
    const query = search ? {name: {$regex: search, $options: "i"}} : {};
    const [data, total] = await Promise.all([
      Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      Brand.countDocuments(query)
    ])
    return res.status(200).json({
      data,
      total,
      pages: Math.ceil(total / limit),
      message: "All brands",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// update brand
export async function updateBrand(req, res) {
  try {
    const id = req.params.id;
    const { name, image, description } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }
    const data = await Brand.findByIdAndUpdate(
      id,
      {
        name,
        image,
        description,
      },
      { new: true }
    );
    return res.status(200).json({
      data,
      message: "Brand updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// delete brand
export async function deleteBrand(req, res) {
  try {
    const id = req.params.id;
    //check if brand has products
    const products = await Product.find({ brand_id: id });
    if (products.length > 0) {
      return res.status(400).json({
        message: "Brand has products, cannot delete",
        error: true,
        success: false,
      });
    }
    const data = await Brand.findByIdAndDelete(id);
    return res.status(200).json({
      data,
      message: "Brand deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// get brand_id by show products
export async function getBrandById(req, res) {
  try {
    let {id, page, limit } = req.query;
    if(!page){
      page = 1;
    }
    if(!limit){
      limit = 10;
    }
    const skip = (page-1)*limit;
    const query = {brand_id: id, status: true};
    const [data, total] = await Promise.all([
      Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("brand_id" , "name"),
      Product.countDocuments(query)
    ])
    return res.status(200).json({
      data,
      total,
      totalPage: Math.ceil(total / limit),
      message: "Brand products",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
};
