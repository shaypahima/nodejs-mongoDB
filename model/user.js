import { model, Schema, Types } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    cartItems: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
})



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
  const cartProductIndex = this.cart.cartItems
    .findIndex(item => item.productId.toString() === productId)
  if (cartProductIndex >= 0) {
    console.log(cartProductIndex);
    const updatedCart = { ...this.cart }
    updatedCart.cartItems.splice(cartProductIndex, 1)
    this.cart = updatedCart
  }
  return this.save()
}


const User = model('User', userSchema)

export default User