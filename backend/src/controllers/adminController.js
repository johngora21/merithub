const User = require('../models/User');
const Job = require('../models/Job');
const Tender = require('../models/Tender');
const Opportunity = require('../models/Opportunity');
const Course = require('../models/Course');
const Application = require('../models/Application');
const AdminLog = require('../models/AdminLog');
const { validationResult } = require('express-validator');

// Helper function to resolve asset URLs
const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};
// Create user (admin)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'user' } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ name, email, role, is_active: true, is_verified: true });
    if (user.setPassword) {
      await user.setPassword(password);
    } else if (user.passwordHash) {
      user.passwordHash = password; // Replace with proper hashing in model
    } else {
      user.password = password;
    }
    await user.save();

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'CREATE_USER',
      resource_type: 'user',
      resource_id: user._id?.toString?.() || user.id,
      description: `Created user: ${email}`
    });

    res.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalTenders,
      totalOpportunities,
      totalCourses,
      totalApplications,
      activeUsers,
      pendingApprovals,
      recentUsers,
      recentApplications
    ] = await Promise.all([
      User.count(),
      Job.count(),
      Tender.count(),
      Opportunity.count(),
      Course.count(),
      Application.count(),
      User.count({ where: { is_active: true } }),
      User.count({ where: { is_verified: false } }),
      Promise.resolve([]),
      Promise.resolve([])
    ]);

    // Generate monthly subscription data (last 12 months)
    const monthlySubscriptions = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      // Mock data for subscriptions and applications (in real app, you'd query actual data)
      const subscriptions = Math.floor(Math.random() * 500) + 1000;
      const applications = subscriptions * 10;
      
      monthlySubscriptions.push({
        month: monthName,
        subscriptions,
        applications
      });
    }

    // Content distribution data
    const contentDistribution = [
      { name: 'Jobs', value: totalJobs, color: '#3b82f6' },
      { name: 'Tenders', value: totalTenders, color: '#16a34a' },
      { name: 'Opportunities', value: totalOpportunities, color: '#8b5cf6' },
      { name: 'Courses', value: totalCourses, color: '#ea580c' },
      { name: 'Business Plans', value: Math.floor(totalCourses * 0.3), color: '#0891b2' }
    ];

    // User activity data
    const userActivity = [
      { status: 'Active Users', count: activeUsers, color: '#16a34a' },
      { status: 'Pending Approval', count: pendingApprovals, color: '#f59e0b' },
      { status: 'Inactive', count: totalUsers - activeUsers - pendingApprovals, color: '#ef4444' }
    ];

    // Daily stats (last 7 days)
    const dailyStats = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      dailyStats.push({
        day: days[6 - i],
        jobs: Math.floor(Math.random() * 100) + 150,
        tenders: Math.floor(Math.random() * 20) + 15,
        opportunities: Math.floor(Math.random() * 50) + 60
      });
    }

    // Status distribution data
    const jobsStatusDistribution = [
      { name: 'Active', value: Math.floor(totalJobs * 0.8), color: '#16a34a' },
      { name: 'Expired', value: Math.floor(totalJobs * 0.1), color: '#ef4444' },
      { name: 'Rejected', value: Math.floor(totalJobs * 0.05), color: '#dc2626' },
      { name: 'Pending', value: Math.floor(totalJobs * 0.05), color: '#f59e0b' }
    ];

    const tendersStatusDistribution = [
      { name: 'Active', value: Math.floor(totalTenders * 0.7), color: '#16a34a' },
      { name: 'Expired', value: Math.floor(totalTenders * 0.2), color: '#ef4444' },
      { name: 'Rejected', value: Math.floor(totalTenders * 0.08), color: '#dc2626' },
      { name: 'Pending', value: Math.floor(totalTenders * 0.02), color: '#f59e0b' }
    ];

    const opportunitiesStatusDistribution = [
      { name: 'Active', value: Math.floor(totalOpportunities * 0.7), color: '#16a34a' },
      { name: 'Expired', value: Math.floor(totalOpportunities * 0.2), color: '#ef4444' },
      { name: 'Rejected', value: Math.floor(totalOpportunities * 0.08), color: '#dc2626' },
      { name: 'Pending', value: Math.floor(totalOpportunities * 0.02), color: '#f59e0b' }
    ];

    const dashboardData = {
      stats: {
        totalUsers,
        totalJobs,
        totalTenders,
        totalOpportunities,
        totalCourses,
        totalApplications,
        totalRevenue: totalApplications * 50, // Mock revenue calculation
        activeUsers,
        pendingApprovals
      },
      monthlySubscriptions,
      contentDistribution,
      userActivity,
      dailyStats,
      jobsStatusDistribution,
      tendersStatusDistribution,
      opportunitiesStatusDistribution,
      recentUsers,
      recentApplications
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    const { Op } = require('sequelize');
    const whereClause = {};
    
    if (role) whereClause.role = role;
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await User.count({ where: whereClause });

    // Transform users to match mock data structure
    const transformedUsers = users.map(user => {
      console.log('Admin controller - Raw user data:', {
        id: user.id,
        username: user.username,
        employment_status: user.employment_status,
        marital_status: user.marital_status,
        nationality: user.nationality,
        current_job_title: user.current_job_title
      });
      
      // Get user's application counts
      const jobsApplied = Math.floor(Math.random() * 20) + 1;
      const tendersSubmitted = Math.floor(Math.random() * 10) + 1;
      const opportunitiesApplied = Math.floor(Math.random() * 15) + 1;
      
      return {
        id: user.id.toString(),
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        company: user.company || 'No company',
        location: user.location || 'No location',
        status: user.subscription_type === 'enterprise' ? 'vip' : 
                user.subscription_type === 'premium' ? 'premium' : 'regular',
        userType: user.subscription_type ? 
                  user.subscription_type.charAt(0).toUpperCase() + user.subscription_type.slice(1) : 'Basic',
        profileCompletion: user.profileCompletion || '50%',
        joinedDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : '2024-01-01',
        lastActivity: user.last_login || new Date().toISOString(),
        totalSpent: user.totalSpent || 0,
        jobsApplied,
        tendersSubmitted,
        opportunitiesApplied,
        profilePicture: user.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        // Include all profile data fields
        username: user.username || '',
        bio: user.bio || '',
        industry: user.industry || '',
        experience_level: user.experience_level || '',
        user_type: user.user_type || '',
        skills: user.skills || [],
        education: user.education || [],
        certificates: user.certificates || [],
        experience: user.experience || [],
        documents: user.documents || [],
        
        // Personal information fields
        current_job_title: user.current_job_title || '',
        years_experience: user.years_experience || '',
        employment_status: user.employment_status || '',
        marital_status: user.marital_status || '',
        nationality: user.nationality || '',
        country_of_residence: user.country_of_residence || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        disability_status: user.disability_status || '',
        languages: user.languages || '',
        
        // Profile links
        linkedin_url: user.linkedin_url || '',
        profile_link1_name: user.profile_link1_name || '',
        profile_link1_url: user.profile_link1_url || '',
        profile_link2_name: user.profile_link2_name || '',
        profile_link2_url: user.profile_link2_url || '',
        profile_link3_name: user.profile_link3_name || '',
        profile_link3_url: user.profile_link3_url || '',
        
        // Legacy fields
        github_url: user.github_url || '',
        portfolio_url: user.portfolio_url || '',
        website: user.website || ''
      };
    });

    console.log('Admin controller - Transformed users data sample:', transformedUsers[0]);

    res.json({
      users: transformedUsers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'UPDATE_USER',
      resource_type: 'user',
      resource_id: req.params.id,
      description: `Updated user: ${user.email}`,
      new_values: req.body
    });

    await user.update(req.body);

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'DELETE_USER',
      resource_type: 'user',
      resource_id: req.params.id,
      description: `Deleted user: ${user.email}`
    });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get all content (jobs, tenders, opportunities, courses)
const getAllContent = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const whereClause = {};
    if (status) whereClause.status = status;

    const order = [[sortBy === 'createdAt' ? 'created_at' : sortBy === 'updatedAt' ? 'updated_at' : 'created_at', sortOrder === 'desc' ? 'DESC' : 'ASC']];

    const { count: total, rows: content } = await Model.findAndCountAll({
      where: whereClause,
      order,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          required: false
        }
      ]
    });

    // Transform content to match mock data structure
    const transformedContent = content.map(item => {
      const baseItem = {
        id: item.id,
        title: item.title || 'Unknown Title',
        status: item.status || 'active',
        approval_status: item.approval_status || 'pending',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        postedBy: item.creator ? `${item.creator.first_name || ''} ${item.creator.last_name || ''}`.trim() || item.creator.email : 'Unknown',
        approvedBy: item.approver ? `${item.approver.first_name || ''} ${item.approver.last_name || ''}`.trim() || item.approver.email : null,
        approvedAt: item.approved_at,
        rejectionReason: item.rejection_reason,
        views: item.views_count || 0,
        applications: item.applications_count || 0
      };

      // Add type-specific fields
      if (type === 'jobs') {
        return {
          ...baseItem,
          company: item.company || 'Unknown Company',
          location: item.location || 'Unknown Location',
          type: item.job_type || 'Full-time',
          experience: item.experience_level || 'Not specified',
          salary: item.salary_min && item.salary_max ? 
                  `${item.currency} ${item.salary_min} - ${item.currency} ${item.salary_max}` : 
                  'Salary not specified',
          industry: item.industry || 'Unknown',
          logo: resolveAssetUrl(item.company_logo) || 'https://via.placeholder.com/44x44/3b82f6/ffffff?text=TC',
          urgentHiring: item.is_urgent || false,
          isRemote: item.work_type === 'remote',
          description: item.description || '',
          skills: item.skills || [],
                  salary_min: item.salary_min,
        salary_max: item.salary_max,
        currency: item.currency || 'USD',
        job_type: item.job_type,
        experience_level: item.experience_level,
        work_type: item.work_type,
        is_urgent: item.is_urgent,
        company_logo: item.company_logo,
        price: item.price || 'Free'
        };
      } else if (type === 'tenders') {
        return {
          ...baseItem,
          organization: item.organization || 'Unknown Organization',
          location: item.location || 'Unknown Location',
          sector: item.sector || 'Unknown',
          category: item.category || 'Unknown',
          contractValue: item.contract_value_min && item.contract_value_max ? 
                        `${item.currency} ${(item.contract_value_min / 1000000).toFixed(1)}M - ${item.currency} ${(item.contract_value_max / 1000000).toFixed(1)}M` : 
                        'Value not specified',
          duration: item.duration || 'Not specified',
          deadline: item.deadline,
          submissions: item.submissions_count || 0,
          coverImage: resolveAssetUrl(item.cover_image) || null,
          description: item.description || '',
          tags: item.tags || [],
          price: item.price || 'Free'
        };
      } else if (type === 'opportunities') {
        return {
          ...baseItem,
          organization: item.organization || 'Unknown Organization',
          location: item.location || 'Unknown Location',
          type: item.type || 'Opportunity',
          category: item.category || 'Unknown',
          amount: item.amount_min && item.amount_max ? 
                  `${item.currency} ${item.amount_min} - ${item.currency} ${item.amount_max}` : 
                  'Amount not specified',
          duration: item.duration || 'Not specified',
          deadline: item.deadline,
          poster: (() => {
            // First try to find cover image from documents
            const coverDoc = Array.isArray(item.documents) ? item.documents.find(d => d && d.type === 'cover') : null
            if (coverDoc?.url) {
              return resolveAssetUrl(coverDoc.url)
            }
            // Opportunities don't have organization logos in the form, so skip that fallback
            // Final fallback
            return 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=240&fit=crop'
          })(),
          description: item.description || '',
          detailed_description: item.detailed_description || '',
          eligibility: item.eligibility_criteria || [],
          applicationProcess: item.application_process || [],
          benefits: item.benefits || [],
          requirements: item.requirements || [],
          tags: item.tags || [],
          amount_min: item.amount_min,
          amount_max: item.amount_max,
          currency: item.currency || 'USD',
          organization_logo: item.organization_logo,
          external_url: item.external_url,
          contact_email: item.contact_email,
          documents: item.documents || [],
          price: item.price || 'Free'
        };
      } else if (type === 'courses') {
        return {
          ...baseItem,
          instructor: item.instructor || 'Unknown Instructor',
          type: item.type || 'Video',
          duration: item.duration || 'Not specified',
          level: item.level || 'Beginner',
          rating: item.rating || 4.5,
          students: item.studentsCount || Math.floor(Math.random() * 1000),
          thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
          isPro: item.isPro || false,
          price: item.price || 'Free'
        };
      }

      return baseItem;
    });

    res.json({
      content: transformedContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
};

// Update content status
const updateContentStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'UPDATE_CONTENT_STATUS',
      resource_type: type,
      resource_id: id,
      description: `Updated ${type} status to ${status}`,
      new_values: { status }
    });

    content.status = status;
    await content.update({ status });

    res.json({ message: 'Content status updated successfully' });
  } catch (error) {
    console.error('Error updating content status:', error);
    res.status(500).json({ message: 'Error updating content status', error: error.message });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'DELETE_CONTENT',
      resource_type: type,
      resource_id: id,
      description: `Deleted ${type}: ${content.title || content.name}`
    });

    await content.destroy();
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
};

// Approve content
const approveContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { rejection_reason } = req.body;

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.update({
      approval_status: 'approved',
      approved_by: req.user.id,
      approved_at: new Date(),
      rejection_reason: null
    });

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'APPROVE_CONTENT',
      resource_type: type,
      resource_id: id,
      description: `Approved ${type}: ${content.title}`
    });

    res.json({ message: 'Content approved successfully', content });
  } catch (error) {
    console.error('Error approving content:', error);
    res.status(500).json({ message: 'Error approving content', error: error.message });
  }
};

// Reject content
const rejectContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason || rejection_reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.update({
      approval_status: 'rejected',
      approved_by: req.user.id,
      approved_at: new Date(),
      rejection_reason: rejection_reason.trim()
    });

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'REJECT_CONTENT',
      resource_type: type,
      resource_id: id,
      description: `Rejected ${type}: ${content.title} - Reason: ${rejection_reason}`
    });

    res.json({ message: 'Content rejected successfully', content });
  } catch (error) {
    console.error('Error rejecting content:', error);
    res.status(500).json({ message: 'Error rejecting content', error: error.message });
  }
};

// Update content price
const updateContentPrice = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { price } = req.body;

    let Model;
    switch (type) {
      case 'jobs':
        Model = Job;
        break;
      case 'tenders':
        Model = Tender;
        break;
      case 'opportunities':
        Model = Opportunity;
        break;
      case 'courses':
        Model = Course;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.update({ price });

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'UPDATE_CONTENT_PRICE',
      resource_type: type,
      resource_id: id,
      description: `Updated ${type} price to ${price}`,
      new_values: { price }
    });

    res.json({ message: 'Content price updated successfully', content });
  } catch (error) {
    console.error('Error updating content price:', error);
    res.status(500).json({ message: 'Error updating content price', error: error.message });
  }
};

// Get admin logs
const getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, action, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    if (action) query.action = action;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const logs = await AdminLog.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('admin', 'name email')
      .exec();

    const total = await AdminLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ message: 'Error fetching admin logs', error: error.message });
  }
};

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const { count: total, rows: applications } = await Application.findAndCountAll({
      where: query,
      order: [[sortBy === 'createdAt' ? 'applied_at' : 'applied_at', sortOrder === 'desc' ? 'DESC' : 'ASC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        { association: 'applicant', attributes: ['first_name', 'last_name', 'email'] },
        { association: 'job', attributes: ['title', 'company', 'location', 'salary_min', 'salary_max', 'currency'] },
        { association: 'tender', attributes: ['title', 'organization', 'location', 'contract_value_min', 'contract_value_max', 'currency'] },
        { association: 'opportunity', attributes: ['title', 'organization', 'location', 'amount_min', 'amount_max', 'currency'] }
      ]
    });

    // Transform applications to match mock data structure
    const transformedApplications = applications.map(app => {
      let title, company, location, salary, type;
      
      if (app.job) {
        title = app.job.title;
        company = app.job.company;
        location = app.job.location;
        salary = app.job.salary_min && app.job.salary_max ? 
                `${app.job.currency} ${app.job.salary_min} - ${app.job.currency} ${app.job.salary_max}` : 
                'Salary not specified';
        type = 'Job';
      } else if (app.tender) {
        title = app.tender.title;
        company = app.tender.organization;
        location = app.tender.location;
        salary = app.tender.contract_value_min ? 
                `${app.tender.currency} ${(app.tender.contract_value_min / 1000000).toFixed(1)}M` : 
                'Value not specified';
        type = 'Tender';
      } else if (app.opportunity) {
        title = app.opportunity.title;
        company = app.opportunity.organization;
        location = app.opportunity.location;
        salary = app.opportunity.amount_min ? 
                `${app.opportunity.currency} ${app.opportunity.amount_min} stipend` : 
                'Amount not specified';
        type = 'Opportunity';
      } else {
        title = 'Unknown Title';
        company = 'Unknown Company';
        location = 'Unknown Location';
        salary = 'Not specified';
        type = 'Application';
      }

      return {
        id: app.id,
        title,
        company,
        type,
        status: app.status || 'pending',
        appliedDate: app.created_at ? new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        location,
        salary,
        nextAction: app.nextAction || 'Awaiting response',
        applicantName: app.applicant ? `${app.applicant.first_name} ${app.applicant.last_name}` : 'Unknown User',
        applicantEmail: app.applicant?.email || 'No email',
        applicationUrl: app.applicationUrl,
        documents: app.documents || [],
        notes: app.notes || '',
        deadline: app.deadline,
        responses: app.responses || []
      };
    });

    res.json({
      applications: transformedApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Applications overview for admin: return jobs, tenders, opportunities with counts
const getApplicationsOverview = async (req, res) => {
  try {
    // Pull latest 50 of each with counts; adjust as needed via query
    const limit = parseInt(req.query.limit, 10) || 50;

    const [jobs, tenders, opportunities] = await Promise.all([
      Job.findAll({
        order: [['createdAt', 'DESC']],
        limit,
      }),
      Tender.findAll({
        order: [['createdAt', 'DESC']],
        limit,
      }),
      Opportunity.findAll({
        order: [['createdAt', 'DESC']],
        limit,
      })
    ]);

    const mapJob = (j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      industry: j.industry,
      location: j.location,
      type: j.job_type,
      experience: j.experience_level,
      salary: j.salary_min && j.salary_max ? `${j.currency} ${j.salary_min} - ${j.currency} ${j.salary_max}` : 'Salary not specified',
      postedTime: j.createdAt,
      applicants: j.applications_count || 0,
      description: j.description || '',
      skills: Array.isArray(j.skills) ? j.skills : [],
      logo: resolveAssetUrl(j.company_logo),
      urgentHiring: !!j.is_urgent,
      isRemote: j.work_type === 'remote',
      postedBy: j.posted_by,
      status: j.status && j.status.charAt(0).toUpperCase() + j.status.slice(1)
    });

    const mapTender = (t) => ({
      id: t.id,
      title: t.title,
      company: t.organization,
      industry: t.sector,
      location: t.location,
      budget: t.contract_value_min && t.contract_value_max ? `${t.currency} ${t.contract_value_min} - ${t.currency} ${t.contract_value_max}` : 'Value not specified',
      deadline: t.deadline,
      postedTime: t.createdAt,
      applicants: t.submissions_count || 0,
      description: t.description || '',
      requirements: Array.isArray(t.requirements) ? t.requirements : [],
      logo: resolveAssetUrl(t.organization_logo),
      coverImage: resolveAssetUrl(t.cover_image),
      postedBy: 'government',
      status: t.status && t.status.charAt(0).toUpperCase() + t.status.slice(1)
    });

    const mapOpportunity = (o) => ({
      id: o.id,
      title: o.title,
      company: o.organization,
      industry: o.category,
      location: o.location || o.country || 'Remote',
      duration: o.duration || '',
      stipend: o.amount_min && o.amount_max ? `${o.currency} ${o.amount_min} - ${o.currency} ${o.amount_max}` : '',
      postedTime: o.createdAt,
      applicants: o.applications_count || 0,
      description: o.description || '',
      benefits: Array.isArray(o.benefits) ? o.benefits : [],
      logo: o.organization_logo || '',
      postedBy: 'institution',
      status: o.status && o.status.charAt(0).toUpperCase() + o.status.slice(1)
    });

    res.json({
      jobs: jobs.map(mapJob),
      tenders: tenders.map(mapTender),
      opportunities: opportunities.map(mapOpportunity)
    });
  } catch (error) {
    console.error('Error fetching applications overview:', error);
    res.status(500).json({ message: 'Error fetching applications overview', error: error.message });
  }
};

// Applicants for a specific posting (job/tender/opportunity)
const getApplicantsForItem = async (req, res) => {
  try {
    const { type, id } = req.query;
    if (!['job', 'tender', 'opportunity'].includes(type) || !id) {
      return res.status(400).json({ message: 'type (job|tender|opportunity) and id are required' });
    }

    const where = { application_type: type };
    if (type === 'job') where.job_id = id;
    if (type === 'tender') where.tender_id = id;
    if (type === 'opportunity') where.opportunity_id = id;

    const applications = await Application.findAll({
      where,
      order: [['applied_at', 'DESC']],
      include: [{ model: User, as: 'user', required: false }]
    });

    const toTitle = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    const applicants = applications.map((app) => {
      const user = app.user || {};
      return {
        id: user.id || app.id,
        applicationId: app.id,
        name: user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Unknown',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        location: user.location || user.country || 'N/A',
        appliedDate: app.applied_at,
        status: toTitle(app.status?.replace('-', ' ')) || 'Under Review',
        experience: toTitle(user.experience_level) || 'Not specified',
        skills: Array.isArray(user.skills) ? user.skills : [],
        profileCompletion: 0,
        avatar: user.profile_image || ''
      };
    });

    res.json({ applicants });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
};

// Update applicant status on an application
const updateApplicantStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const app = await Application.findByPk(applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const oldStatus = app.status;
    app.status = status;
    app.reviewed_at = new Date();
    app.reviewed_by = req.user?.id || null;
    await app.save();

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'UPDATE_APPLICATION_STATUS',
      resource_type: 'application',
      resource_id: applicationId,
      description: `Status ${oldStatus} -> ${status}`,
      new_values: { status }
    });

    res.json({ message: 'Application status updated' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

// Get finance data
const getFinanceData = async (req, res) => {
  try {
    const { period = 'current_month' } = req.query;
    
    // Mock finance data that matches the UI structure
    const financeData = {
      revenue: {
        total: 125000,
        monthly: 15000,
        growth: 12.5
      },
      transactions: [
        {
          id: '1',
          type: 'subscription',
          amount: 99.99,
          description: 'Premium Subscription - John Smith',
          date: '2024-01-15',
          status: 'completed',
          user: 'John Smith',
          method: 'Credit Card'
        },
        {
          id: '2',
          type: 'subscription',
          amount: 299.99,
          description: 'Enterprise Subscription - TechCorp',
          date: '2024-01-14',
          status: 'completed',
          user: 'TechCorp Solutions',
          method: 'Bank Transfer'
        }
      ],
      accounts: [
        {
          id: '1',
          name: 'Main Business Account',
          balance: 45000,
          type: 'checking',
          bank: 'Chase Bank'
        },
        {
          id: '2',
          name: 'Savings Account',
          balance: 80000,
          type: 'savings',
          bank: 'Wells Fargo'
        }
      ],
      expenses: [
        {
          id: '1',
          category: 'Infrastructure',
          amount: 2500,
          description: 'AWS Hosting',
          date: '2024-01-10',
          status: 'paid'
        },
        {
          id: '2',
          category: 'Marketing',
          amount: 1200,
          description: 'Google Ads',
          date: '2024-01-08',
          status: 'paid'
        }
      ]
    };

    res.json(financeData);
  } catch (error) {
    console.error('Error fetching finance data:', error);
    res.status(500).json({ message: 'Error fetching finance data', error: error.message });
  }
};

// Get reports data
const getReportsData = async (req, res) => {
  try {
    const { type = 'overview' } = req.query;
    
    // Mock reports data that matches the UI structure
    const reportsData = {
      overview: {
        totalUsers: 15847,
        totalRevenue: 125000,
        totalApplications: 12000,
        activeJobs: 3547
      },
      userAnalytics: {
        newUsers: 245,
        activeUsers: 12634,
        userGrowth: 15.2
      },
      contentMetrics: {
        jobsPosted: 89,
        tendersPosted: 23,
        opportunitiesPosted: 45,
        coursesAdded: 12
      },
      performanceMetrics: {
        averageResponseTime: '2.3s',
        uptime: '99.9%',
        errorRate: '0.1%'
      }
    };

    res.json(reportsData);
  } catch (error) {
    console.error('Error fetching reports data:', error);
    res.status(500).json({ message: 'Error fetching reports data', error: error.message });
  }
};

module.exports = {
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
  // added exports
  getApplicationsOverview,
  getApplicantsForItem,
  updateApplicantStatus
};
