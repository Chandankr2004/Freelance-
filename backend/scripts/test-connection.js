const { testConnection } = require('../config/database');
require('dotenv').config();

async function test() {
  console.log('🔌 Testing database connection...');
  console.log('📊 Connection details:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   Database: ${process.env.DB_NAME || 'freelancing_marketplace'}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log('');
  
  await testConnection();
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Connection test failed:', err.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('   1. Make sure MySQL is running');
  console.log('   2. Check your database credentials in .env file');
  console.log('   3. Verify the database exists: CREATE DATABASE freelancing_marketplace;');
  console.log('   4. Check if the user has proper permissions');
  console.log('   5. Ensure MySQL service is started');
  process.exit(1);
});

