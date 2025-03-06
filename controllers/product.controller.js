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


