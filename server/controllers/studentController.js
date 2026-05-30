const asyncHandler = require('../utils/asyncHandler');
const Student = require('../models/Student');

const buildStudentFilter = (query) => {
  const filter = {};
  const search = query.search?.trim();

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } }
    ];
  }

  if (query.name) {
    filter.fullName = { $regex: query.name.trim(), $options: 'i' };
  }

  if (query.department) {
    filter.department = query.department.trim();
  }

  if (query.course) {
    filter.course = query.course.trim();
  }

  if (query.semester) {
    const semester = Number(query.semester);
    if (!Number.isNaN(semester)) {
      filter.semester = semester;
    }
  }

  return filter;
};

const buildSort = (query) => {
  const allowedSortFields = new Set(['fullName', 'semester', 'createdAt']);
  const sortBy = allowedSortFields.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  return { [sortBy]: sortOrder };
};

const normalizeStudentPayload = (body) => ({
  fullName: body.fullName?.trim(),
  email: body.email?.trim().toLowerCase(),
  mobile: body.mobile?.trim(),
  gender: body.gender?.trim(),
  dob: body.dob,
  department: body.department?.trim(),
  course: body.course?.trim(),
  semester: Number(body.semester),
  address: body.address?.trim()
});

const validateStudentPayload = (payload) => {
  const requiredFields = ['fullName', 'email', 'mobile', 'gender', 'dob', 'department', 'course', 'semester', 'address'];
  const missingFields = requiredFields.filter((field) => !payload[field] && payload[field] !== 0);

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^\+?[0-9]{10,15}$/;

  if (!emailPattern.test(payload.email)) {
    return 'Please provide a valid email address';
  }

  if (!mobilePattern.test(payload.mobile)) {
    return 'Please provide a valid mobile number';
  }

  if (Number.isNaN(payload.semester) || payload.semester < 7 || payload.semester > 12) {
    return 'Class must be a valid number between 7 and 12';
  }

  const dob = new Date(payload.dob);
  if (Number.isNaN(dob.getTime())) {
    return 'Please provide a valid date of birth';
  }

  if (dob >= new Date()) {
    return 'Date of birth must be in the past';
  }

  if (!['Male', 'Female', 'Other'].includes(payload.gender)) {
    return 'Gender must be Male, Female, or Other';
  }

  return null;
};

const listStudents = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 1000);
  const filter = buildStudentFilter(req.query);
  const sort = buildSort(req.query);

  const [students, totalStudents] = await Promise.all([
    Student.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter)
  ]);

  return res.json({
    students,
    totalStudents,
    page,
    limit,
    totalPages: Math.ceil(totalStudents / limit) || 1
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json(student);
});

const createStudent = asyncHandler(async (req, res) => {
  const payload = normalizeStudentPayload(req.body);
  const validationMessage = validateStudentPayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const duplicateStudent = await Student.findOne({ email: payload.email });

  if (duplicateStudent) {
    return res.status(400).json({ message: 'Student email already exists' });
  }

  const student = await Student.create(payload);

  return res.status(201).json({
    message: 'Student created successfully',
    student
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const payload = normalizeStudentPayload(req.body);
  const validationMessage = validateStudentPayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const duplicateStudent = await Student.findOne({
    email: payload.email,
    _id: { $ne: student._id }
  });

  if (duplicateStudent) {
    return res.status(400).json({ message: 'Student email already exists' });
  }

  Object.assign(student, payload);
  await student.save();

  return res.json({
    message: 'Student updated successfully',
    student
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  await student.deleteOne();

  return res.json({ message: 'Student deleted successfully' });
});

const getStudentStats = asyncHandler(async (req, res) => {
  const [totalStudents, departmentCounts, courseCounts, recentStudents] = await Promise.all([
    Student.countDocuments(),
    Student.aggregate([
      { $group: { _id: '$department' } },
      { $count: 'count' }
    ]),
    Student.aggregate([
      { $group: { _id: '$course' } },
      { $count: 'count' }
    ]),
    Student.find().sort({ createdAt: -1 }).limit(5)
  ]);

  return res.json({
    totalStudents,
    totalDepartments: departmentCounts[0]?.count || 0,
    totalCourses: courseCounts[0]?.count || 0,
    recentStudents
  });
});

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
};