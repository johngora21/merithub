const User = require('../models/User');
const BlockedEmail = require('../models/BlockedEmail');
const { generateToken } = require('../../config/jwt');
const { Op } = require('sequelize');
const https = require('https');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/images');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Determine file type based on field name
    const fileType = file.fieldname === 'certificateFile' ? 'certificate' : 
                    file.fieldname === 'documentFile' ? 'document' : 'profile';
    cb(null, fileType + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type - allow images, PDFs, and documents
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed. Only images, PDFs, and documents are allowed'), false);
    }
  }
});

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, location, country, userType } = req.body;

    // Check if email is blocked
    const blockedEmail = await BlockedEmail.findOne({ where: { email } });
    if (blockedEmail) {
      return res.status(403).json({
        success: false,
        message: 'This email address has been blocked and cannot be used for registration'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by the model hook
      first_name,
      last_name,
      phone,
      location,
      country,
      user_type: userType
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      phone, 
      bio, 
      location, 
      country, 
      skills, 
      experience_level, 
      industry,
      current_job_title,
      username,
      years_experience,
      employment_status,
      education,
      certificates,
      experience,
      documents,
      marital_status,
      nationality,
      country_of_residence,
      date_of_birth,
      gender,
      disability_status,
      languages,
      linkedin_url,
      profile_link1_name,
      profile_link1_url,
      profile_link2_name,
      profile_link2_url,
      profile_link3_name,
      profile_link3_url
    } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare update data
    const updateData = {};
    
    // Update basic fields if provided
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (country !== undefined) updateData.country = country;
    if (skills !== undefined) updateData.skills = skills;
    if (experience_level !== undefined) updateData.experience_level = experience_level;
    if (industry !== undefined) updateData.industry = industry;
    if (current_job_title !== undefined) updateData.current_job_title = current_job_title;
    if (username !== undefined) updateData.username = username;
    if (years_experience !== undefined) updateData.years_experience = years_experience;
    if (employment_status !== undefined) updateData.employment_status = employment_status;
    
    // Update personal information fields
    if (marital_status !== undefined) updateData.marital_status = marital_status;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (country_of_residence !== undefined) updateData.country_of_residence = country_of_residence;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
    if (gender !== undefined) updateData.gender = gender;
    if (disability_status !== undefined) updateData.disability_status = disability_status;
    if (languages !== undefined) updateData.languages = languages;
    
    // Update LinkedIn profile
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    
    // Update profile links
    if (profile_link1_name !== undefined) updateData.profile_link1_name = profile_link1_name;
    if (profile_link1_url !== undefined) updateData.profile_link1_url = profile_link1_url;
    if (profile_link2_name !== undefined) updateData.profile_link2_name = profile_link2_name;
    if (profile_link2_url !== undefined) updateData.profile_link2_url = profile_link2_url;
    if (profile_link3_name !== undefined) updateData.profile_link3_name = profile_link3_name;
    if (profile_link3_url !== undefined) updateData.profile_link3_url = profile_link3_url;
    
    // Update complex data fields if provided
    if (education !== undefined) updateData.education = education;
    if (certificates !== undefined) updateData.certificates = certificates;
    if (experience !== undefined) updateData.experience = experience;
    if (documents !== undefined) updateData.documents = documents;

    // Update user fields
    await user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(current_password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await user.update({ password_hash: new_password });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    // If we reach here, the token is valid (middleware already verified it)
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled on the client side
    // by removing the token. However, you could implement token blacklisting here.
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile image if it exists
    if (user.profile_image) {
      const oldImagePath = path.join(__dirname, '../../uploads/images', path.basename(user.profile_image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new profile image path
    const imageUrl = `/uploads/images/${req.file.filename}`;
    await user.update({ profile_image: imageUrl });

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profile_image: imageUrl,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message
    });
  }
};

const uploadCertificateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No certificate file provided'
      });
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Certificate file uploaded successfully',
      data: {
        file_url: fileUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Upload certificate file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload certificate file',
      error: error.message
    });
  }
};

const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided'
      });
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Document file uploaded successfully',
      data: {
        file_url: fileUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Upload document file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document file',
      error: error.message
    });
  }
};

// Google Login: verify ID token via Google tokeninfo, find/create user, return our JWT
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'idToken is required' });
    }

    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;

    const fetchTokenInfo = () => new Promise((resolve, reject) => {
      https.get(tokenInfoUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => data += chunk);
        resp.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error_description || parsed.error) {
              return reject(new Error(parsed.error_description || parsed.error));
            }
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    const info = await fetchTokenInfo();
    const email = info.email;
    const emailVerified = info.email_verified === 'true' || info.email_verified === true;
    const googleSub = info.sub;
    const givenName = info.given_name || '';
    const familyName = info.family_name || '';

    if (!email || !emailVerified) {
      return res.status(400).json({ success: false, message: 'Email not verified by Google' });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        password_hash: Math.random().toString(36).slice(2),
        first_name: givenName,
        last_name: familyName,
        is_verified: true,
        is_active: true,
        oauth_provider: 'google',
        oauth_sub: googleSub
      });
    } else {
      await user.update({ last_login: new Date(), oauth_provider: 'google', oauth_sub: user.oauth_sub || googleSub });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.json({ success: true, message: 'Google login successful', data: { user: user.toJSON(), token } });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ success: false, message: 'Google login failed', error: error.message });
  }
};

// Final exports
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  logout,
  uploadProfileImage,
  uploadCertificateFile,
  uploadDocumentFile,
  upload,
  googleLogin
};