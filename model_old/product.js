import { ObjectId } from "mongodb";
import { getProductCollection } from "../util/database.js";
import User from "./user.js";


class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.price = +price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId
  }


  async create() {
    try {
      await getProductCollection().insertOne(this)
      console.log('Product saved');

    } catch (error) {
      console.log(error);
    }
  }

  static async find(query) {
    try {
      const products = await getProductCollection().find(query).toArray()
      return products
    } catch (error) {
      console.log(error);

    }
  }

  static async findAll() {
    try {
      const products = await this.find({})
      return products
    } catch (error) {
      console.log(error);
    }
  }

  static async findByPk(id) {
    try {

      const product = await getProductCollection().findOne({
        _id: ObjectId.createFromHexString(id)
      })
      return product
    } catch (error) {
      console.log(error);
    }
  }

  async replaceOne(id) {
    try {

      const objectId = ObjectId.createFromHexString(id)

      await getProductCollection().replaceOne({ _id: objectId }, this)

    } catch (error) {
      console.log(error);
    }
  }

  static async deleteOne(id) {
    try {
      const objectId = ObjectId.createFromHexString(id)
      await getProductCollection().deleteOne({ _id: objectId })

    } catch (error) {
      console.log(error);
    }
  }

  async addToCart(userId){  
    User.findByPk(userId)
  }
}

export default Product

