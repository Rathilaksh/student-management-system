const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/jwt');
const getAuthCookieOptions = require('../utils/cookieOptions');
const User = require('../models/User');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id });

  res.cookie(process.env.COOKIE_NAME || 'sms_token', token, getAuthCookieOptions());

  return res.json({
    message: 'Login successful',
    user: sanitizeUser(user)
  });
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'sms_token', {
    ...getAuthCookieOptions(),
    maxAge: undefined
  });

  return res.json({ message: 'Logout successful' });
});

const seedDefaultAdmin = async () => {
  const defaultEmail = 'admin@example.com';
  const defaultPassword = 'Admin@123';

  const existingAdmin = await User.findOne({ email: defaultEmail });

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  return User.create({
    name: 'System Admin',
    email: defaultEmail,
    password: hashedPassword,
    role: 'admin'
  });
};

module.exports = {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
  seedDefaultAdmin
};