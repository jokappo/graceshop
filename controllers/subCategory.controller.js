import SubCategoryModel from "../models/subCategory.model.js";

//create subcategory
export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    if (!name || !image || !category[0]) {
      return res.status(400).json({
        message: "Enter require filed",
        error: true,
        success: false,
      });
    }

    //ajouter le sub category
    const payload = {
      name,
      image,
      category,
    };

    const AddSubCategory = new SubCategoryModel(payload);
    const saveSubCategory = await AddSubCategory.save();

    if (!saveSubCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Sub Category added successfully",
      data: saveSubCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//get subcategory
export const GetSubCategoryController = async (req, res) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return res.json({
      message: "Sub Category list",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//update sub category
export const UpdateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, category } = req.body;

    //verifier si la sub category existe
    const subCategory = await SubCategoryModel.findById(_id);
    if (!subCategory) {
      return res.status(404).json({
        message: "Sub Category not found",
        error: true,
        success: false,
      });
    }

    //update
    const update = await SubCategoryModel.updateOne(
      { _id },
      {
        name,
        image,
        category,
      }
    );
    if (update.modifiedCount === 0) {
      return res.status(400).json({
        message: "Sub Category not updated",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Sub Category updated",
      data: update,
      error: false,
      success: true,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
