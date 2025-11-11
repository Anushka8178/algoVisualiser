import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Algorithm from "./Algorithm.js";

const VisualizationState = sequelize.define("VisualizationState", {
  state: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  lastSavedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

User.hasMany(VisualizationState, { foreignKey: "userId", onDelete: "CASCADE" });
VisualizationState.belongsTo(User, { foreignKey: "userId" });

Algorithm.hasMany(VisualizationState, { foreignKey: "algorithmId", onDelete: "CASCADE" });
VisualizationState.belongsTo(Algorithm, { foreignKey: "algorithmId" });

export default VisualizationState;

