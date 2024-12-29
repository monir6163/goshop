import slugify from "slugify";
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.model.js";

// Create SubCategory
export async function createSubCategory(req, res) {
  try {
    const { name, image, category, description } = req.body;
    if (!name || !image || !category[0]) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }
    const payload = {
      name,
      slug: slugify(name, {
        trim: true,
        lower: true,
      }),
      image,
      category_id: category,
      description,
    };
    const subCategory = new SubCategory(payload);
    const data = await subCategory.save();
    return res.status(201).json({
      message: "SubCategory created successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// Get All SubCategory
export async function getSubCategories(req, res) {
  try {
    const data = await SubCategory.find()
      .sort({ name: 1 })
      .populate("category_id");
    return res.status(200).json({
      data,
      message: "All SubCategory",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// get subcategory admin
export async function getSubCategoriesAdmin(req, res) {
  try {
    const {page, limit, search} = req.query;
    if(!page){
      page = 1;
    }
    if(!limit){
      limit = 12;
    }
    const query = search ? {name: {$regex: search, $options: "i"}} : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      SubCategory.find(query)
      .sort({createdAt: -1})
      .populate('category_id')
      .skip(skip)
      .limit(limit),
      SubCategory.countDocuments(query)
    ])
    return res.status(200).json({
      data,
      total,
      pages: Math.ceil(total / limit),
      message: "All SubCategory",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// Update SubCategory
export async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, image, category, description } = req.body;
    if (!name || !image || !category[0]) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }
    const payload = {
      name,
      image,
      category_id: category,
      description,
    };
    const data = await SubCategory.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return res.status(200).json({
      message: "SubCategory updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// Delete SubCategory
export async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    // check have any product in this subcategory
    const isProduct = await Product.findOne({ subCategory_id: id });
    if (isProduct) {
      return res.status(400).json({
        message: "Can't delete this subcategory, have some product",
        error: true,
        success: false,
      });
    }
    await SubCategory.findByIdAndDelete(id);
    return res.status(200).json({
      message: "SubCategory deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}
