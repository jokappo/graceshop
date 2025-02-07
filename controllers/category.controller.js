import categoryModel from "../models/category.model.js";

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
    })

    const saveCategory = await addCayegory.save()

    if (!saveCategory) {
        return res.status(500).json({
            message: "Not Created",
            error: true,
            success: false,
        })
    }

    return res.json({
        message: "Category added successfully",
        data: saveCategory,
        error: false,
        success: true,
    })


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
    const data = await categoryModel.find()
    return res.json({
      message: "Category fetched successfully",
      data: data,
      error: false,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}


