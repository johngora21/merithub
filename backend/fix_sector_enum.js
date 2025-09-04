const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixSectorEnum() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'merit_platform'
  });

  try {
    await connection.execute(`
      ALTER TABLE tenders 
      MODIFY COLUMN sector ENUM(
        'construction', 'technology', 'healthcare', 'education', 'government', 
        'manufacturing', 'logistics', 'energy', 'agriculture', 'finance', 
        'retail', 'transportation', 'utilities', 'consulting', 'media', 
        'hospitality', 'real_estate', 'legal', 'non_profit', 'other'
      ) NOT NULL
    `);
    console.log('✅ Sector ENUM updated successfully!');
  } catch (error) {
    console.error('❌ Error updating sector ENUM:', error.message);
  } finally {
    await connection.end();
  }
}

fixSectorEnum();
