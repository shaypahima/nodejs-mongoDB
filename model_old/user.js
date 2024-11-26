import { ObjectId } from "mongodb";
import { getUserCollection } from "../util/database.js";
import Product from "./product.js";

//user:
// {
//  _id: objectId(string)
//  email: string
//  name: string
//  cart:[{ _id: objectId(string),quantity: int }...]
// }
//

class User {
  constructor(email, name) {
    this.email = email
    this.name = name
    this.cart = []

  }
  async create() {
    try {
      await getUserCollection().insertOne(this)
      console.log('user created!');
    } catch (error) {
      console.log(error);
    }
  }
  static async getUserCart(id) {
    try {
      const user = await this.findByPk(id)
      const cart = []
      const pushToCart = async (cartItem) => {
        const id = cartItem._id.toString()
        const { quantity } = cartItem
        const { title, price, description, imageUrl } = await Product.findByPk(id)
        const cartObj = { id, title, price:+price, description, imageUrl, quantity }
        console.log(cartObj);
        cart.push(cartObj)
      }
      for (let cartItem of user.cart) {
        await pushToCart(cartItem)
      }
      return cart
    } catch (error) {
      console.log(error);
    }


  }

  static async addProductToUserCart(userId, prodId) {
    let update;
    let query = {
      "_id": userId,
      "cart._id": prodId,
    }
    try {
      const user = await getUserCollection().findOne(query)

      if (!user) {
        query = { "_id": userId }
        update = {
          $push: {
            cart: {
              "_id": prodId,
              "quantity": 1
            }
          }
        }
      } else {

        update = {
          $inc: { "cart.$.quantity": 1 }

        }
      }
      await getUserCollection().updateOne(query, update)
      console.log('product added successfully');

    } catch (error) {
      console.log(error);
    }
  }


  static async findByPk(id) {
    try {
      let _id = id
      if (!(id instanceof ObjectId)) {
        _id = ObjectId.createFromHexString(id)
      }
      const user = await getUserCollection().findOne({ _id })
      return user

    } catch (error) {
      console.log(error);
    }
  }

}

export default User