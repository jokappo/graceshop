import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.ObjectId,
        ref : 'product',
    },

    quantity : {
        type : Number,
        default : 1
    },

    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
    }
},{
    timestamps : true
})

const cartProductModel  = mongoose.model("cartProduct", cartProductSchema)

export default cartProductModel