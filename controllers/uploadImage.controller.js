import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'

const uploadImageController = async (req, res) => {
    try {
        const file = req.file
        const uploadImage = await uploadImageCloudinary(file)

        return res.json({
            message : 'upload done',
            data : uploadImage,
            success : true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export default uploadImageController