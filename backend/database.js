const mysql = require('mysql');
require('dotenv').config();

console.log("\n" + "=".repeat(60));
console.log("🗄️  DATABASE INITIALIZATION");
console.log("=".repeat(60));

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'final_database',
});

db.connect((err) => {
  if (err) {
    console.error("\n❌ Error: Failed to connect to MySQL database");
    console.error(`   Message: ${err.message}`);
    console.error(`   Host: ${process.env.MYSQL_HOST}`);
    console.error(`   User: ${process.env.MYSQL_USER}`);
    console.error(`   Database: ${process.env.MYSQL_DATABASE}`);
    console.error(`   Please ensure MySQL is running and database exists\n`);
    process.exit(1);
  } else {
    console.log("✅ MySQL Database connection successful");
    console.log(`   🖥️  Host: ${process.env.MYSQL_HOST || 'localhost'}`);
    console.log(`   👤 User: ${process.env.MYSQL_USER || 'root'}`);
    console.log(`   📊 Database: ${process.env.MYSQL_DATABASE || 'final_database'}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}\n`);
  }
});

module.exports = db;