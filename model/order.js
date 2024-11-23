import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})

export default Order