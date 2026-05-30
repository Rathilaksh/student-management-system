const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { seedDefaultAdmin } = require('./controllers/authController');
const createApp = require('./app');

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const missingProductionEnv = [];
if (NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) missingProductionEnv.push('JWT_SECRET');
  if (!MONGO_URI) missingProductionEnv.push('MONGO_URI');
}

if (!process.env.NODE_ENV) {
  console.warn(
    'Warning: NODE_ENV is not set. Defaulting to development. For Railway deployments, set NODE_ENV=production.'
  );
}

if (missingProductionEnv.length > 0) {
  throw new Error(
    `Missing required production environment variable(s): ${missingProductionEnv.join(
      ', '
    )}. Add them to Railway variables or your production environment.`
  );
}

if (!process.env.JWT_SECRET) {
  console.warn(
    'Warning: JWT_SECRET is not set. Using a development fallback secret. Do not use this in production.'
  );
  process.env.JWT_SECRET = 'dev-jwt-secret-change-in-production';
}

const jwtConfigured = Boolean(process.env.JWT_SECRET);
const mongoConfigured = Boolean(MONGO_URI);

const app = createApp();

console.log('Starting server with configuration:');
console.log(`  NODE_ENV=${NODE_ENV}`);
console.log(`  PORT=${PORT}`);
console.log(`  JWT_SECRET=${jwtConfigured ? 'configured' : 'not configured'}`);
console.log(`  MONGO_URI=${mongoConfigured ? 'configured' : 'not configured'}`);
console.log(`  CLIENT_URL=${CLIENT_URL}`);

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  let mongoConnected = false;
  try {
    await connectDB();
    await seedDefaultAdmin();
    mongoConnected = true;
  } catch (error) {
    console.error('MongoDB connected: false');
    console.error(`Startup error: ${error.message}`);
  } finally {
    console.log(`MongoDB connected: ${mongoConnected}`);
  }
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});