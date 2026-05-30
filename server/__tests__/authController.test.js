const { seedDefaultAdmin, loginAdmin, getCurrentAdmin } = require('../controllers/authController');

describe('authController exports', () => {
  test('exports seedDefaultAdmin as a function', () => {
    expect(typeof seedDefaultAdmin).toBe('function');
  });

  test('exports loginAdmin and getCurrentAdmin as functions', () => {
    expect(typeof loginAdmin).toBe('function');
    expect(typeof getCurrentAdmin).toBe('function');
  });
});
