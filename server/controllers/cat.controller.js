import slugify from "slugify";
import Category from "../models/category.model.js";
import DynamicShow from "../models/dynamicShow.model.js";
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.model.js";

//create category
export async function createCategory(req, res) {
  try {
    const { name, image, description } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "All Field are required",
        error: true,
        success: false,
      });
    }

    const check = await Category.findOne({ name: name.trim() });
    if (check) {
      return res.status(409).json({
        message: "category allready exist",
        error: true,
        success: false,
      });
    }
    await Category.create({
      name: name.trim(),
      slug: slugify(name, {
        trim: true,
        lower: true,
      }),
      image: image,
      description: description,
    });
    return res.status(201).json({
      message: "category create success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "category create faield", error: true, success: false });
  }
}

//get category
export async function getCategories(req, res) {
  try {
    // sort by alphabetically
    const categories = await Category.find({
      status: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      data: categories,
      message: "category get success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "category get faield",
      error: true,
      success: false,
    });
  }
}

//get category for admin
export async function getCategoriesAdmin(req, res) {
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
    // sort by alphabetically
    const [data, total] = await Promise.all([
      Category.find(query)
      // .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      Category.countDocuments(query),
    ]);

    return res.status(200).json({
      data,
      total,
      pages: Math.ceil(total / limit),
      message: "category get success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "category get faield",
      error: true,
      success: false,
    });
  }
}

// get all category home page
export async function getAllCategories(req, res) {
  try {
    const categories = await DynamicShow.find({ showOnHome: true }).populate(
      "category_id"
    );
    return res.status(200).json({
      data: categories,
      message: "category get success",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "category get faield",
      error: true,
      success: false,
    });
  }
}

//update category
export async function updateCategory(req, res) {
  try {
    const { _id, name, image, description } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Category _id required",
        error: true,
        success: false,
      });
    }
    await Category.findByIdAndUpdate(
      _id,
      {
        ...(name && { name: name }),
        // ...(slug && { slug: slug }),
        ...(description && { description: description }),
        ...(image && { image: image }),
      },
      { new: true }
    );
    return res.status(200).json({
      message: "category update success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "category update faield", error: true, success: false });
  }
}

//delete category
export async function DeleteCategory(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "Category _id required",
        error: true,
        success: false,
      });
    }
    //check sub category and product before delete
    const checkSubCat = await SubCategory.find({
      category_id: {
        $in: [id],
      },
    }).countDocuments();
    const checkProduct = await Product.find({
      category_id: {
        $in: [id],
      },
    }).countDocuments();
    if (checkSubCat > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category have sub category or product",
        error: true,
        success: false,
      });
    }
    await Category.findByIdAndDelete(id);
    return res.status(200).json({
      message: "category delete success",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "category delete faield",
      error: true,
      success: false,
    });
  }
}

// update category showOnHome
export async function updateCategoryShowOnHome(req, res) {
  try {
    const { id, showOnHome } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Category id required",
        error: true,
        success: false,
      });
    }

    // check category exist or not
    const check = await DynamicShow.find({ category_id: id });
    if (check.length > 0) {
      const upd = await DynamicShow.findOneAndUpdate(
        { category_id: id },
        {
          showOnHome: showOnHome,
        },
        { new: true }
      );
      const cat = await Category.findByIdAndUpdate(
        id,
        {
          showOnHome: showOnHome,
        },
        { new: true }
      );
    } else {
      await DynamicShow.create({
        category_id: id,
        showOnHome: showOnHome,
      });
      await Category.findByIdAndUpdate(id, { showOnHome: showOnHome }, { new: true });
    }
    return res.status(200).json({
      message: "category show On Home",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "category showOnHome update faield",
      error: true,
      success: false,
    });
  }
}
