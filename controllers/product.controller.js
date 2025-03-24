import productModel from "../models/product.model.js";

//create product
export const AddProductContoller = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      dicount,
      description,
      more_details,
    } = req.body;

    //verify if data exist
    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return res.status(404).json({
        message: "Please fill all the fields",
        error: true,
        success: false,
      });
    }

    const product = new productModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      dicount,
      description,
      more_details,
    });

    const save = await product.save();
    if (!save) {
      return res.status(404).json({
        message: "Product not saved",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Product saved successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//get product
export const GetProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;
    if (!page) {
      page = 2;
    }

    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      productModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product retrieved successfully",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//get product by category
export const GetProductByCategoryController = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Category id is required",
        success: false,
        error: true,
      });
    }

    const data = await productModel
      .find({ category: { $in: id } })
      .sort({ createdAt: -1 })
      .limit(15);

    return res.json({
      message: "Category product list",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//get product by category and subcategory
export const GetProductByCategoryAndSubcategoryController = async (
  req,
  res
) => {
  try {
    const { categoryID, subcategoryID, page, limit } = req.body;
    if (!categoryID || !subcategoryID) {
      return res.status(400).json({
        message: "Category and subcategory id is required",
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
      category: { $in: categoryID },
      subcategory: { $in: subcategoryID },
    };

    const skip = (page - 1) * limit;

    const { data, dataCount } = await Promise.all([
      productModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product list by category and subcategory",
      success: true,
      error: false,
      data: data,
      limit: limit,
      page: page,
      totalCount: dataCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
