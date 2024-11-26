import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const OrderItem = sequelize.define('orderItem', {
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

export default OrderItem