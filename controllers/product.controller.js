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
        more_details
    })

    const save = await product.save()
    if (!save) {
        return res.status(404).json({
            message: "Product not saved",
            error: true,
            success: false
        })
    }

    return res.json({
        message: "Product saved successfully",
        error: false,
        success: true,
        data : save
    })

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

    let { page, limit, search } = req.body
    if (!page) {
      page = 2
    }

    if (!limit) {
      limit = 10
    }

    const query = search ? {
      $text : {
        $search : search
      }
    } : {}
    const skip = (page - 1) * limit

    const [data, totalCount] = await Promise.all([
      productModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit),
      productModel.countDocuments(query)
    ])

    return res.json({
      message: "Product retrieved successfully",
      error: false,
      success: true,
      totalCount : totalCount,
      totalNoPage : Math.ceil(
        totalCount / limit
      ),
      data : data
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    })
  }
}

