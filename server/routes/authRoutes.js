const express = require('express');
const { getCurrentAdmin, loginAdmin, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getCurrentAdmin);
router.post('/logout', protect, logoutAdmin);

module.exports = router;