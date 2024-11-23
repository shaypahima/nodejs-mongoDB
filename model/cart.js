import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true
  },
})

export default Cart