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
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
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
    const { categoryId, subcategoryId, page, limit } = req.body;
    if (!categoryId || !subcategoryId) {
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
      category: { $in: categoryId },
      subCategory: { $in: subcategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      productModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product list by category and subcategory",
      query,
      success: true,
      error: false,
      data,
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

//getp product details
export const GetProductDetailsController = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        message: "Product id is required",
        success: false,
        error: true,
      });
    }

    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Product details",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//update product
export const UpdateProductController = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Product id is required",
        success: false,
        error: true,
      });
    }

    const update = await productModel.updateOne({ _id : _id }, {
      ...req.body
    })

    if (!update) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      })
    }

    return res.json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data : update
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//delete product
export const DeleteProductControler = async (req, res) => {
  try {
    const { _id } = req.body
    if (!_id) {
      return res.status(400).json({
        message: "Product id is required",
        success: false,
        error: true,
      });
    }

    const deleteProduct = await productModel.deleteOne({_id : _id })

    return res.json({
      message : "deleted successfully",
      error : false,
      success : true,
      data : deleteProduct
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

