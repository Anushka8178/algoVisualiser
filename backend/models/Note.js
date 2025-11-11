import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Algorithm from "./Algorithm.js";

const Note = sequelize.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "userId" });

Algorithm.hasMany(Note, { foreignKey: "algorithmId", onDelete: "CASCADE" });
Note.belongsTo(Algorithm, { foreignKey: "algorithmId" });

export default Note;

