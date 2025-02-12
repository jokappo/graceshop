import categoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import productModel from "../models/product.model.js";

//ajouter une cathegory
export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    //verifier que les deux sont bien rentré
    if (!name || !image) {
      return res.status(400).json({
        message: "Enter require filed",
        error: true,
        success: false,
      });
    }

    //ajouter la cat
    const addCayegory = new categoryModel({
      name,
      image,
    });

    const saveCategory = await addCayegory.save();

    if (!saveCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Category added successfully",
      data: saveCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//afficher les categories cree
export const getCategoryController = async (req, res) => {
  try {
    const data = await categoryModel.find().sort({ createdAt: -1});
    return res.json({
      message: "Category fetched successfully",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId, name, image } = req.body;

    //verifier si la category existe
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    const update = await categoryModel.updateOne(
      {
        _id: categoryId,
      },
      {
        name,
        image,
      }
    );
    if (update.modifiedCount === 0) {
      return res.status(400).json({
        message: "Category not updated",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Category updated successfully",
      error: false,
      success: true,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;
    const category = await categoryModel.findById(_id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    //check if category was used in another model
    const checkSubcategory = await SubCategoryModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    const checkProduct = await productModel
      .find({
        categoryId: {
          $in: [_id],
        },
      })
      .countDocuments();

    if (checkSubcategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category is used in another model",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await categoryModel.deleteOne({ _id: _id });
    if (deleteCategory.deletedCount === 0) {
      return res.status(400).json({
        message: "Category not deleted",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Category deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
