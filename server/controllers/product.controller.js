import slugify from "slugify";
import Product from "../models/product.model.js";

// store product
export async function storeProduct(req, res) {
  try {
    const {
      name,
      image,
      thumbnail,
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
      !thumbnail ||
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
      thumbnail,
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
    const products = await Product.find({ category_id: { $in: id }, status: true })
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
// export async function getProductByCatAndSubCat(req, res) {
//   try {
//     const { category_id, subcategory_id, page, limit } = req.body;
//     if (!category_id || !subcategory_id) {
//       return res.status(400).json({
//         message: "category_id and subcategory_id are required",
//         success: false,
//         error: true,
//       });
//     }
//     if (!page) {
//       page = 1;
//     }
//     if (!limit) {
//       limit = 10;
//     }
//     const query = {
//       category_id: { $in: category_id },
//       subCategory_id: { $in: subcategory_id },
//       status: true
//     };
//     const skip = (page - 1) * limit;
//     const [data, total] = await Promise.all([
//       Product.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit),
//       Product.countDocuments(query),
//     ]);
//     return res.status(200).json({
//       data,
//       total,
//       page: Math.ceil(total / limit),
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: error.message, success: false, error: true });
//   }
// }
export async function getProductByCatAndSubCat(req, res) {
  try {
    const { category_id, subcategory_id, page = 1, limit = 10, sortBy = "newest" } = req.body;

    // Validate required fields
    if (!category_id || !subcategory_id) {
      return res.status(400).json({
        message: "category_id and subcategory_id are required",
        success: false,
        error: true,
      });
    }

    const query = {
      category_id: { $in: category_id },
      subCategory_id: { $in: subcategory_id },
      status: true,
    };

    const sortOptions = {
      newest: { createdAt: -1 },
      discount: { discount: -1 }, 
      priceLowToHigh: { price: 1 },
      priceHighToLow: { price: -1 }, 
      rating: { rating: -1 },
      name: { name: 1 }, 
    };

    const sortCriteria = sortOptions[sortBy] || sortOptions.newest;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Product.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      success: true,
      error: false,
    });
  } catch (error) {
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

// Product search
export async function searchProduct(req, res) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    // Ensure page and limit are integers
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    // Build query object
    const query = search.trim()
      ? {
          $and: [{ $text: { $search: search.trim() } }, { status: true }],
        }
      : { status: true };

    const skip = (currentPage - 1) * itemsPerPage;

    const [data, dataCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage)
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
      totalPage: Math.ceil(dataCount / itemsPerPage),
      page: currentPage,
      limit: itemsPerPage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}

// update product status
export async function UpdateProductStatus(req, res) {
  try {
    const { id, status } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Category id required",
        error: true,
        success: false,
      });
    }
    const productStatus = await Product.findByIdAndUpdate({_id: id}, {
      status: status
    }, {new:true})
    return res.json({
      message: "Product Status Update",
      error: false,
      success: true,
      data: productStatus
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
}
