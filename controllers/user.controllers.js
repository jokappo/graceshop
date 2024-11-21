import sendEmail from "../config/senEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifuEmailTemplate.js";

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "provide name, email and password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})

        if (user) {
            return res.status(400).json({
                message: "user already exists",
                error : true,
                success : false
                })
        }

        const salt  = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const payload = {
            name,
            email,
            password : hashedPassword
        }
        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FROMTEND_URL}/verify-email?code=${save?._id}`

        const verify_email = await sendEmail({
            sendTo : email,
            subject : 'verify email from GraceShop',
            html : verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })

        return res.json({
            message : "user created successfully",
            error : false,
            success : true,
            data : save
        })

    } catch (error) {
        return res.status(500).json({
             message: error.message || error,
             error : true,
             success : false
        });
    }
}
