const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    console.log('🔌 Connecting to MySQL server...');
    
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('✅ Connected to MySQL server');
    
    const dbName = process.env.DB_NAME || 'freelancing_marketplace';
    
    // Create database
    console.log(`📦 Creating database: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log(`✅ Database '${dbName}' created successfully!`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check MySQL credentials in .env file');
    console.log('   2. Ensure MySQL server is running');
    console.log('   3. Verify user has CREATE DATABASE privilege');
    process.exit(1);
  }
}

createDatabase();

