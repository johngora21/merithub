const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const controller = require('../controllers/savedItemsController');

router.use(authenticateToken);
router.get('/', controller.listSavedItems);
router.post('/', controller.saveItem);
router.delete('/:key', controller.removeItem);

module.exports = router;