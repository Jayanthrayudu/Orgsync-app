const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

dotenv.config();

// Setup Sequelize with SSL
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, process.env.DB_CA_PATH)),
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OrgSync Backend Running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models to ensure tables exist
    await db.sync({ alter: true });
    console.log('✅ Database synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
