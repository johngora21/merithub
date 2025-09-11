const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const jobRoutes = require('./jobs');
const tenderRoutes = require('./tenders');
const opportunityRoutes = require('./opportunities');
const applicationRoutes = require('./applications');
const coursesRoutes = require('./courses');
const adminRoutes = require('./admin');
const savedItemsRoutes = require('./savedItems');
const uploadRoutes = require('./uploads');
const notificationsRoutes = require('./notifications');

// API version prefix
const API_PREFIX = '/api';

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/jobs`, jobRoutes);
router.use(`${API_PREFIX}/tenders`, tenderRoutes);
router.use(`${API_PREFIX}/opportunities`, opportunityRoutes);
router.use(`${API_PREFIX}/applications`, applicationRoutes);
router.use(`${API_PREFIX}/courses`, coursesRoutes);
router.use(`${API_PREFIX}/admin`, adminRoutes);
router.use(`${API_PREFIX}/saved-items`, savedItemsRoutes);
router.use(`${API_PREFIX}/notifications`, notificationsRoutes);
router.use(`${API_PREFIX}/uploads`, uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Merit Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler for API routes
router.use(`${API_PREFIX}/*`, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = router;