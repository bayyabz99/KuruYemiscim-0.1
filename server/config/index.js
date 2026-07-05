require('dotenv').config();
const path = require('path');

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'kuruyemiscim-dev-secret-change-in-production',
  rootDir: path.join(__dirname, '../..'),
  uploadsDir: process.env.UPLOADS_DIR || path.join(__dirname, '../../public/uploads'),
  dbPath: process.env.DB_PATH || path.join(__dirname, '../../data/kuruyemis.db'),
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
};
