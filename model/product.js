import { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required:true,
  },
  description: {
    type: String,
    required:true
  },
  imageUrl: {
    type: String,
    required:true
  },
  price: {
    type: Number,
    required:true
  },
  userId:{
    type: Types.ObjectId,
    ref: 'User',
    required:true
  }
})

const Product = model('Product', productSchema)

export default Product