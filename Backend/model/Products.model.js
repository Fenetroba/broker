import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    countInStock:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    numReviews:{
        type:Number,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Product owner is required']
      },

},{timestamps:true});
const Product=mongoose.model("Product",ProductSchema);
export default Product;
