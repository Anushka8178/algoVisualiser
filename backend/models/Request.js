import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Request = sequelize.define("Request", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  algorithmSlug: { type: DataTypes.STRING, allowNull: false },
  note: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "in_progress", "completed"),
    defaultValue: "pending",
  },
  educatorNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

User.hasMany(Request, { foreignKey: "studentId", as: "requests", onDelete: "CASCADE" });
Request.belongsTo(User, { foreignKey: "studentId", as: "student" });

export default Request;


