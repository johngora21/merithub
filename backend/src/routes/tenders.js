const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const authController = require('../controllers/authController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (with optional authentication for personalized results)
router.get('/', optionalAuth, tenderController.getAllTenders);
router.get('/stats', tenderController.getTenderStats);
router.get('/:id', optionalAuth, tenderController.getTenderById);

// Protected routes (supports cover image and documents upload)
router.post('/', authenticateToken, authController.upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), tenderController.createTender);
router.put(
  '/:id',
  authenticateToken,
  authController.upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  tenderController.updateTender
);
router.delete('/:id', authenticateToken, tenderController.deleteTender);

module.exports = router;
