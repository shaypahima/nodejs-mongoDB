import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER
  }
})

export default CartItem