import mongoose from "mongoose";

const productScheme = new mongoose.Schema({
    name : {
        type : String,
    },

    image :{
        type : Array,
        default : []
    },

    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category'
        }
    ],

    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'
        }
    ],

    unit : {
        type : String,
        default : ""
    },

    stock : {
        type : Number,
        default : 0
    },

    price : {
        type : Number,
        default : 0
    },

    dicount : {
        type : Number,
        default : null
    },

    description : {
        type : String,
        default : ""
    },

    more_details : {
        type : Object,
        default : {}
    },

    publish : {
        type : Boolean,
        default : false
    }

},{
    timestamps : true
})

const productModel = mongoose.model("product", productScheme)

export default productModel