import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5433;

if (!dbName || !dbUser || !dbPass) {
  console.error("❌ Database configuration missing!");
  console.error("Required environment variables:");
  console.error("  - DB_NAME:", dbName || "❌ MISSING");
  console.error("  - DB_USER:", dbUser || "❌ MISSING");
  console.error("  - DB_PASS:", dbPass ? "***" : "❌ MISSING");
  console.error("\nPlease check your .env file in the backend directory.");
  process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  logging: false, // Set to console.log for debugging
  dialectOptions: {
    connectTimeout: 10000,
  },
  retry: {
    max: 3,
  },
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection authenticated");
  })
  .catch((err) => {
    console.error("❌ Database authentication failed!");
    console.error("Error details:", err.message);
    console.error("\nTroubleshooting:");
    console.error("1. Check if PostgreSQL is running");
    console.error("2. Verify database credentials in .env file:");
    console.error(`   DB_NAME=${dbName}`);
    console.error(`   DB_USER=${dbUser}`);
    console.error(`   DB_HOST=${dbHost}`);
    console.error(`   DB_PORT=${dbPort}`);
    console.error("3. Make sure the database exists: CREATE DATABASE " + dbName + ";");
    console.error("4. Verify the user has access to the database");
    process.exit(1);
  });

export default sequelize;
