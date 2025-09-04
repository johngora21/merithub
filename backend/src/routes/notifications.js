const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { bulkSend } = require('../controllers/notificationsController');

router.use(authenticateToken);
router.use(requireAdmin);

// Bulk notifications: { channel: 'email'|'sms', recipients: string[], message: string }
router.post('/bulk', bulkSend);

module.exports = router;