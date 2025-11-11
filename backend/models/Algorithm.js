import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Algorithm = sequelize.define("Algorithm", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  complexity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  material: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  visualizationUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  visualizationCode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Algorithm;

