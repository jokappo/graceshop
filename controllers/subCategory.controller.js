import SubCategoryModel from "../models/subCategory.model.js";

//create subcategory
export const AddSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body

        if ( !name || !image || !category[0] ) {
            return res.status(400).json({
                message : "Enter require filed",
                error : true,
                success : false
            })
        }

        //ajouter le sub category
        const payload = {
            name,
            image,
            category
        }

        const AddSubCategory = new SubCategoryModel(payload)
        const saveSubCategory = await AddSubCategory.save()

        if (!saveSubCategory) {
            return res.status(500).json({
                message : "Not Created",
                error : true,
                success : false
            })
        }

        return res.json({
            message : "Sub Category added successfully",
            data : saveSubCategory,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

//get subcategory
export const GetSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().sort({ createdAt : -1})
        return res.json({
            message : "Sub Category list",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

