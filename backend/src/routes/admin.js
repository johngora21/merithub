const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getAllContent,
  updateContentStatus,
  deleteContent,
  approveContent,
  rejectContent,
  updateContentPrice,
  getAdminLogs,
  getAllApplications,
  getFinanceData,
  getReportsData,
  getApplicationsOverview,
  getApplicantsForItem,
  updateApplicantStatus,
  downloadDocument
} = require('../controllers/adminController');
const { body } = require('express-validator');

// Apply auth and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.post('/users', [
  body('name').optional().notEmpty(),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
], createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], updateUser);
router.delete('/users/:id', deleteUser);

// Content management
router.get('/content', getAllContent);
// Include content type in params so controller can resolve correct model
router.put('/content/:type/:id/status', updateContentStatus);
router.put('/content/:type/:id/approve', approveContent);
router.put('/content/:type/:id/reject', [
  body('rejection_reason').notEmpty().withMessage('Rejection reason is required')
], rejectContent);
router.put('/content/:type/:id/price', [
  body('price').isIn(['Free', 'Pro']).withMessage('Price must be Free or Pro')
], updateContentPrice);
router.delete('/content/:type/:id', deleteContent);

// Applications management
router.get('/applications', getAllApplications);
router.get('/applications/overview', getApplicationsOverview);
router.get('/applications/applicants', getApplicantsForItem);
router.put('/applications/:applicationId/status', updateApplicantStatus);

// Admin logs
router.get('/logs', getAdminLogs);

// Finance
router.get('/finance', getFinanceData);

// Reports
router.get('/reports', getReportsData);

// Document download
router.get('/download/:userId/:documentId', downloadDocument);

module.exports = router;



