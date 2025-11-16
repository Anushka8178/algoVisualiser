import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");
const examplePath = path.join(__dirname, "ENV_EXAMPLE.txt");

console.log("🔍 Checking .env Configuration\n");

if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found!\n");
  console.log("📝 Creating .env from ENV_EXAMPLE.txt...");
  
  if (fs.existsSync(examplePath)) {
    const content = fs.readFileSync(examplePath, "utf8");
    fs.writeFileSync(envPath, content);
    console.log("✅ .env file created!\n");
    console.log("⚠️  IMPORTANT: Please edit .env and update:");
    console.log("   - DB_PASS: Your actual PostgreSQL password");
    console.log("   - DB_NAME: 'algodb' or 'algovisualizer' (whichever exists)\n");
  } else {
    console.log("❌ ENV_EXAMPLE.txt not found!\n");
  }
  process.exit(1);
}

// Read and display current config (hide password)
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");

console.log("Current .env configuration:\n");

let hasIssues = false;
const required = {
  DB_NAME: false,
  DB_USER: false,
  DB_PASS: false,
  PORT: false,
  JWT_SECRET: false
};

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim();
    
    if (key && required.hasOwnProperty(key)) {
      required[key] = true;
      
      if (key === "DB_PASS") {
        console.log(`  ${key}: ${value ? "***" : "❌ MISSING"}`);
        if (!value || value === "your_postgres_password_here" || value === "postgres") {
          console.log("     ⚠️  Make sure this is your actual PostgreSQL password!");
          hasIssues = true;
        }
      } else if (key === "DB_NAME") {
        console.log(`  ${key}: ${value || "❌ MISSING"}`);
        if (value === "algovisualizer") {
          console.log("     💡 Tip: If you have 'algodb' database, change this to 'algodb'");
        }
      } else {
        console.log(`  ${key}: ${value || "❌ MISSING"}`);
        if (!value) hasIssues = true;
      }
    }
  }
});

console.log("");

// Check for missing required fields
const missing = Object.entries(required).filter(([_, exists]) => !exists);
if (missing.length > 0) {
  console.log("❌ Missing required fields:");
  missing.forEach(([key]) => console.log(`   - ${key}`));
  console.log("");
}

if (hasIssues || missing.length > 0) {
  console.log("📋 To fix:");
  console.log("   1. Open backend/.env in a text editor");
  console.log("   2. Update DB_PASS with your actual PostgreSQL password");
  console.log("   3. If you have 'algodb' database, set DB_NAME=algodb");
  console.log("   4. Save the file and run: npm run setup-db\n");
  process.exit(1);
} else {
  console.log("✅ .env file looks good!\n");
  console.log("Next step: Run 'npm run setup-db' to verify database connection\n");
}

