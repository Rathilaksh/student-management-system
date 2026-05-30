const express = require('express');
const {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentStats,
  listStudents,
  updateStudent
} = require('../controllers/studentController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStudentStats);
router.get('/', listStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;