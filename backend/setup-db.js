import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const dbName = process.env.DB_NAME || "algodb";
const dbUser = process.env.DB_USER || "postgres";
const dbPass = process.env.DB_PASS || "postgres";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5433;

async function setupDatabase() {
  console.log("🔧 Database Setup Script");
  console.log("======================\n");

  console.log("Current Configuration:");
  console.log(`  DB_NAME: ${dbName}`);
  console.log(`  DB_USER: ${dbUser}`);
  console.log(`  DB_HOST: ${dbHost}`);
  console.log(`  DB_PORT: ${dbPort}`);
  console.log(`  DB_PASS: ${dbPass ? "***" : "❌ MISSING"}\n`);

  // Check if .env file exists
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.log("⚠️  .env file not found!");
    console.log("📝 Creating .env file from ENV_EXAMPLE.txt...");
    
    const examplePath = path.join(__dirname, "ENV_EXAMPLE.txt");
    if (fs.existsSync(examplePath)) {
      const exampleContent = fs.readFileSync(examplePath, "utf8");
      fs.writeFileSync(envPath, exampleContent);
      console.log("✅ .env file created. Please update it with your actual credentials.\n");
    } else {
      console.log("❌ ENV_EXAMPLE.txt not found. Creating basic .env file...");
      const basicEnv = `DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASS=${dbPass}
DB_HOST=${dbHost}
DB_PORT=${dbPort}
PORT=5000
JWT_SECRET=dev_secret_key_change_in_production
`;
      fs.writeFileSync(envPath, basicEnv);
      console.log("✅ Basic .env file created. Please update it with your actual credentials.\n");
    }
  }

  // Try to connect to PostgreSQL as superuser to create database
  console.log("🔍 Testing PostgreSQL connection...");

  try {
    // First, try to connect to default 'postgres' database
    const adminSequelize = new Sequelize("postgres", dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: "postgres",
      logging: false,
    });

    await adminSequelize.authenticate();
    console.log("✅ Connected to PostgreSQL server\n");

    // Check if database exists
    const [results] = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );

    if (results.length === 0) {
      console.log(`📦 Database '${dbName}' does not exist. Creating...`);
      await adminSequelize.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created successfully\n`);
    } else {
      console.log(`✅ Database '${dbName}' already exists\n`);
    }

    await adminSequelize.close();

    // Now test connection to the actual database
    console.log(`🔍 Testing connection to '${dbName}' database...`);
    const sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: "postgres",
      logging: false,
    });

    await sequelize.authenticate();
    console.log(`✅ Successfully connected to '${dbName}' database\n`);

    await sequelize.close();

    console.log("✅ Database setup complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Make sure your .env file has correct credentials");
    console.log("   2. Run: npm run dev");
    console.log("   3. The server will automatically create all tables\n");

  } catch (error) {
    console.error("\n❌ Database setup failed!");
    console.error(`Error: ${error.message}\n`);
    
    console.log("🔧 Troubleshooting steps:");
    console.log("   1. Make sure PostgreSQL is running");
    console.log("   2. Check your .env file credentials:");
    console.log(`      DB_NAME=${dbName}`);
    console.log(`      DB_USER=${dbUser}`);
    console.log(`      DB_HOST=${dbHost}`);
    console.log(`      DB_PORT=${dbPort}`);
    console.log("   3. Verify PostgreSQL is accessible:");
    console.log(`      psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d postgres`);
    console.log("   4. If using a different database name, update DB_NAME in .env\n");
    
    process.exit(1);
  }
}

setupDatabase();

