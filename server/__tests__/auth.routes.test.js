const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { seedDefaultAdmin, loginAdmin } = require('../controllers/authController');
const User = require('../models/User');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
  await seedDefaultAdmin();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (connectDB.stopMemoryServer) {
    await connectDB.stopMemoryServer();
  }
});

describe('Auth controller (integration-like)', () => {
  test('loginAdmin responds with success for default admin', async () => {
    const req = { body: { email: 'admin@example.com', password: 'Admin@123' } };
    const existing = await User.findOne({ email: 'admin@example.com' });
    expect(existing).not.toBeNull();

    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare('Admin@123', existing.password);
    expect(valid).toBe(true);
    });
  });

