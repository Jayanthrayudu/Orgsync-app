const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_PORT = process.env.DB_PORT || 4000; // TiDB Cloud default port
const caPath = path.join(__dirname, 'ca.pem'); // adjust path if needed

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: DB_PORT, // specify port
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true, // must for TiDB Cloud
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Optional: test connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = sequelize;
