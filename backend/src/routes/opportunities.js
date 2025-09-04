const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const authController = require('../controllers/authController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (with optional authentication for personalized results)
router.get('/', optionalAuth, opportunityController.getAllOpportunities);
router.get('/stats', opportunityController.getOpportunityStats);
router.get('/:id', optionalAuth, opportunityController.getOpportunityById);

// Protected routes
router.post(
  '/',
  authenticateToken,
  authController.upload.fields([
    { name: 'organizationLogo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  opportunityController.createOpportunity
);
router.put(
  '/:id',
  authenticateToken,
  authController.upload.fields([
    { name: 'organizationLogo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  opportunityController.updateOpportunity
);
router.delete('/:id', authenticateToken, opportunityController.deleteOpportunity);

module.exports = router;
