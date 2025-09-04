const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Protected routes
router.get('/', authenticateToken, applicationController.getAllApplications);
router.get('/my-applications', authenticateToken, applicationController.getUserApplications);
router.get('/stats', authenticateToken, applicationController.getApplicationStats);
router.get('/:id', authenticateToken, applicationController.getApplicationById);
router.post('/', authenticateToken, applicationController.createApplication);
router.put('/:id/status', authenticateToken, applicationController.updateApplicationStatus);

module.exports = router;
