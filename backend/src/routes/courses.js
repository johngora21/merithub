const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/coursesController');

// Public routes
router.get('/', controller.list);
router.get('/:id', controller.getById);

// User protected routes
router.get('/my-courses', authenticateToken, controller.getMyCourses);
router.post('/enroll', authenticateToken, controller.enrollInCourse);
router.put('/progress/:enrollment_id', authenticateToken, controller.updateCourseProgress);

// Admin protected
router.use(authenticateToken);
router.use(requireAdmin);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;