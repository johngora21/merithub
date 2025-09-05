const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCoverImageColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'merit_platform'
  });

  try {
    await connection.execute('ALTER TABLE tenders ADD COLUMN cover_image VARCHAR(500) AFTER organization_logo');
    console.log('✅ cover_image column added successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ cover_image column already exists!');
    } else {
      console.error('❌ Error adding column:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addCoverImageColumn();

