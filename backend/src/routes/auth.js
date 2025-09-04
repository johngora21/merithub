const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

// Protected routes
router.get('/verify', authenticateToken, authController.verifyToken);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);
router.post('/upload-profile-image', authenticateToken, authController.upload.single('profileImage'), authController.uploadProfileImage);
router.post('/upload-certificate-file', authenticateToken, authController.upload.single('certificateFile'), authController.uploadCertificateFile);
router.post('/upload-document-file', authenticateToken, authController.upload.single('documentFile'), authController.uploadDocumentFile);

module.exports = router;
