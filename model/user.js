import { model, Schema, Types } from "mongoose";

import getResetKey from "../util/create-reset-key.js";

const itemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
}, { _id: false })

const orderSchema = new Schema({
  orderItems: [itemSchema],
  totalPrice: { type: Number, required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: {
    cartItems: [itemSchema]
  },
  orders: [orderSchema],
  resetPassKey: { type: String }
})

userSchema.methods.addOrder = async function () {
  const newOrder = {}
  const cartItems = await this.getCartItems()

  newOrder.totalPrice = cartItems.
    reduce((total, curItem) => total + curItem.price * curItem.quantity, 0)
  newOrder.orderItems = cartItems.map(item => {
    return {
      productId: item.id,
      quantity: item.quantity
    }
  })

  this.orders = [...this.orders, newOrder]
  this.cart.cartItems = []
  return this.save()

}


userSchema.methods.getOrderById = async function (orderId) {
  const orderIndex = this.orders
    .findIndex(item => item._id.toString() === orderId)

  await this.populate("orders." + orderIndex + ".orderItems.productId")

  const orderItems = this.orders[orderIndex].orderItems.map(product => {
    const { title, description, imageUrl, price } = product.productId.toObject()
    return { title, description, imageUrl, price, quantity: product.quantity }
  })
  const { totalPrice, createdAt: dateObj } = this.orders[orderIndex];
  const createdAt = dateObj.toLocaleDateString()
  return {
    orderItems, totalPrice, createdAt
  }
}

userSchema.methods.addToCart = function (productId) {
  const cartProductIndex = this.cart.cartItems
    .findIndex(item => item.productId.toString() === productId)
  const updatedCart = { ...this.cart }
  if (cartProductIndex >= 0) {
    updatedCart.cartItems[cartProductIndex].quantity++
  } else {
    updatedCart.cartItems.push({
      productId,
      quantity: 1
    })
  }
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.getCartItems = async function () {
  const cart = await this.cart.populate('cartItems.productId')
  const products = cart.cartItems.map(item => {
    return {
      ...item.productId.toObject(),
      id: item.productId._id,
      quantity: item.quantity,
    }

  })
  return products
}
userSchema.methods.deleteCartItem = function (productId) {

  const updatedCartItems = this.cart.cartItems
    .filter(item => item.productId.toString() !== productId)
  this.cart.cartItems = updatedCartItems
  return this.save()
}

userSchema.methods.getResetPassKey = async function () {

}

userSchema.methods.setResetToken = async function () {
  try {
    const token = await getResetKey(32)

    this.resetPassKey = token
    await this.save()
    return token
  } catch (error) {
    console.log(error);
  }
}


const User = model('User', userSchema)

export default User