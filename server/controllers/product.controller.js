import slugify from "slugify";
import Product from "../models/product.model.js";

// store product
export async function storeProduct(req, res) {
  try {
    const {
      name,
      image,
      category_id,
      subcategory_id,
      brand_id,
      unit,
      stock,
      price,
      discount,
      description,
      more_info,
    } = req.body;
    if (
      !name ||
      !image[0] ||
      !category_id[0] ||
      !subcategory_id[0] ||
      !brand_id[0] ||
      !unit ||
      !stock ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }
    const product = new Product({
      name,
      slug: slugify(name, {
        trim: true,
        lower: true,
      }),
      image,
      category_id,
      subCategory_id: subcategory_id,
      brand_id,
      unit,
      stock,
      price,
      discount,
      description,
      more_info,
    });
    await product.save();
    return res
      .status(201)
      .json({ message: "Product created", success: true, error: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// get all products with pagination admin
export async function getProducts(req, res) {
  try {
    const { page, limit, search } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const query = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Product.find(query)
        .populate("category_id", ["name", "status"])
        .populate("subCategory_id", "name")
        .populate("brand_id", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);
    return res.status(200).json({
      data,
      total,
      pages: Math.ceil(total / limit),
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// category wise products home page
export async function getCategoryProducts(req, res) {
  try {
    const { id } = req.params;
    const products = await Product.find({ category_id: { $in: id } })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({ products, success: true, error: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// get product by category and subcategory id
export async function getProductByCatAndSubCat(req, res) {
  try {
    const { category_id, subcategory_id, page, limit } = req.body;
    if (!category_id || !subcategory_id) {
      return res.status(400).json({
        message: "category_id and subcategory_id are required",
        success: false,
        error: true,
      });
    }
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const query = {
      category_id: { $in: category_id },
      subCategory_id: { $in: subcategory_id },
    };
    const skip = (page - 1) * limit;
    const [data, dataCount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);
    return res.status(200).json({
      data,
      total: dataCount,
      page: Math.ceil(dataCount / limit),
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// get single product by id
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Product id is required",
        success: false,
        error: true,
      });
    }
    const product = await Product.findById(id)
      .populate("category_id", ["name", "status", "slug"])
      .populate("subCategory_id", ["name", "slug"])
      .populate("brand_id", ["name", "slug"]);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({ data: product, success: true, error: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// update product by id
export async function UpdateProductDetails(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id || !data) {
      return res.status(400).json({
        message: "Product data is required",
        success: false,
        error: true,
      });
    }
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ data: product, message: "Product updated", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// delete product by id
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Product id is required",
        success: false,
        error: true,
      });
    }
    await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Product deleted", success: true, error: false });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

//product search
export async function searchProduct(req, res) {
  try {
    const { search = "", page, limit } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    //search product name, description regex
    const query = search.trim() ? { $text: { $search: search.trim() } } : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category_id", ["name", "status"])
        .populate("subCategory_id", "name")
        .populate("brand_id", "name"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}
