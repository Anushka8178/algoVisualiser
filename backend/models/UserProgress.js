import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Algorithm from "./Algorithm.js";

const UserProgress = sequelize.define("UserProgress", {
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  activityType: {
    type: DataTypes.ENUM("viewed", "completed", "note_created"),
    defaultValue: "viewed",
    allowNull: false,
  },
});

User.hasMany(UserProgress, { foreignKey: "userId", onDelete: "CASCADE" });
UserProgress.belongsTo(User, { foreignKey: "userId" });

Algorithm.hasMany(UserProgress, { foreignKey: "algorithmId", onDelete: "CASCADE" });
UserProgress.belongsTo(Algorithm, { foreignKey: "algorithmId" });

export default UserProgress;

