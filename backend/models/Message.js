import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Message = sequelize.define("Message", {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Message from your educator",
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Message.belongsTo(User, { as: "educator", foreignKey: "educatorId" });
Message.belongsTo(User, { as: "student", foreignKey: "studentId" });

export default Message;


