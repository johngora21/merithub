const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authController = require('../controllers/authController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (with optional authentication for personalized results)
router.get('/', optionalAuth, jobController.getAllJobs);
router.get('/stats', jobController.getJobStats);
router.get('/:id', optionalAuth, jobController.getJobById);

// Protected routes (supports company logo upload)
router.post('/', authenticateToken, authController.upload.single('companyLogo'), jobController.createJob);
router.put('/:id', authenticateToken, jobController.updateJob);
router.delete('/:id', authenticateToken, jobController.deleteJob);

module.exports = router;
