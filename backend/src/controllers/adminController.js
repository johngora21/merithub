const { User, Job, Tender, Opportunity, Application, Course, BlockedEmail } = require('../models');
const { Op } = require('sequelize');
const AdminLog = require('../models/AdminLog');
const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');

// Helper function to resolve asset URLs
const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Helper function to convert country code to full name
const getCountryName = (code) => {
  const countryMap = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AD': 'Andorra', 'AO': 'Angola',
    'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia',
    'AT': 'Austria', 'AZ': 'Azerbaijan', 'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh',
    'BB': 'Barbados', 'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin',
    'BT': 'Bhutan', 'BO': 'Bolivia', 'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana',
    'BR': 'Brazil', 'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi',
    'CV': 'Cabo Verde', 'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada',
    'CF': 'Central African Republic', 'TD': 'Chad', 'CL': 'Chile', 'CN': 'China',
    'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CD': 'Congo (Democratic Republic)',
    'CR': 'Costa Rica', 'CI': 'Côte d\'Ivoire', 'HR': 'Croatia', 'CU': 'Cuba',
    'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti',
    'DM': 'Dominica', 'DO': 'Dominican Republic', 'EC': 'Ecuador', 'EG': 'Egypt',
    'SV': 'El Salvador', 'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia',
    'ET': 'Ethiopia', 'FJ': 'Fiji', 'FI': 'Finland', 'FR': 'France', 'GA': 'Gabon',
    'GM': 'Gambia', 'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana', 'GR': 'Greece',
    'GD': 'Grenada', 'GT': 'Guatemala', 'GN': 'Guinea', 'GW': 'Guinea-Bissau',
    'GY': 'Guyana', 'HT': 'Haiti', 'HN': 'Honduras', 'HU': 'Hungary', 'IS': 'Iceland',
    'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran', 'IQ': 'Iraq', 'IE': 'Ireland',
    'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica', 'JP': 'Japan', 'JO': 'Jordan',
    'KZ': 'Kazakhstan', 'KE': 'Kenya', 'KI': 'Kiribati', 'KP': 'North Korea',
    'KR': 'South Korea', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan', 'LA': 'Laos',
    'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya',
    'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MG': 'Madagascar',
    'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta',
    'MH': 'Marshall Islands', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MX': 'Mexico',
    'FM': 'Micronesia', 'MD': 'Moldova', 'MC': 'Monaco', 'MN': 'Mongolia',
    'ME': 'Montenegro', 'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar',
    'NA': 'Namibia', 'NR': 'Nauru', 'NP': 'Nepal', 'NL': 'Netherlands',
    'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria',
    'MK': 'North Macedonia', 'NO': 'Norway', 'OM': 'Oman', 'PK': 'Pakistan',
    'PW': 'Palau', 'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay',
    'PE': 'Peru', 'PH': 'Philippines', 'PL': 'Poland', 'PT': 'Portugal',
    'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia', 'RW': 'Rwanda',
    'KN': 'Saint Kitts and Nevis', 'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines',
    'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome and Principe', 'SA': 'Saudi Arabia',
    'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone',
    'SG': 'Singapore', 'SK': 'Slovakia', 'SI': 'Slovenia', 'SB': 'Solomon Islands',
    'SO': 'Somalia', 'ZA': 'South Africa', 'SS': 'South Sudan', 'ES': 'Spain',
    'LK': 'Sri Lanka', 'SD': 'Sudan', 'SR': 'Suriname', 'SE': 'Sweden',
    'CH': 'Switzerland', 'SY': 'Syria', 'TJ': 'Tajikistan', 'TZ': 'Tanzania',
    'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TO': 'Tonga',
    'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan',
    'TV': 'Tuvalu', 'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates',
    'GB': 'United Kingdom', 'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan',
    'VU': 'Vanuatu', 'VA': 'Vatican City', 'VE': 'Venezuela', 'VN': 'Vietnam',
    'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
  };
  return countryMap[code] || code;
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
      basicUsers,
      proUsers,
      enterpriseUsers,
      approvedApplications,
      shortlistedApplications,
      rejectedApplications,
      // Jobs status counts
      activeJobs,
      expiredJobs,
      rejectedJobs,
      pendingJobs,
      // Tenders status counts
      activeTenders,
      expiredTenders,
      rejectedTenders,
      pendingTenders,
      // Opportunities status counts
      activeOpportunities,
      expiredOpportunities,
      rejectedOpportunities,
      pendingOpportunities,
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
      User.count({ where: { subscription_type: null } }),
      User.count({ where: { subscription_type: 'premium' } }),
      User.count({ where: { subscription_type: 'enterprise' } }),
      Application.count({ where: { status: { [Op.in]: ['approved', 'accepted'] } } }),
      Application.count({ where: { status: 'shortlisted' } }),
      Application.count({ where: { status: 'rejected' } }),
      // Jobs status counts
      Job.count({ where: { status: 'active' } }),
      Job.count({ where: { status: 'expired' } }),
      Job.count({ where: { status: 'rejected' } }),
      Job.count({ where: { status: 'pending' } }),
      // Tenders status counts
      Tender.count({ where: { status: 'active' } }),
      Tender.count({ where: { status: 'expired' } }),
      Tender.count({ where: { status: 'rejected' } }),
      Tender.count({ where: { status: 'pending' } }),
      // Opportunities status counts
      Opportunity.count({ where: { status: 'active' } }),
      Opportunity.count({ where: { status: 'expired' } }),
      Opportunity.count({ where: { status: 'rejected' } }),
      Opportunity.count({ where: { status: 'pending' } }),
      // Recent users (last 5)
      User.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'first_name', 'last_name', 'email', 'created_at', 'user_type']
      }),
      // Recent applications (last 5)
      Application.findAll({
        limit: 5,
        order: [['applied_at', 'DESC']]
      })
    ]);

    // Generate monthly subscription data (last 12 months) - using real data
    const monthlySubscriptions = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      // Get real subscription data for this month
      const subscriptions = await User.count({
        where: {
          created_at: {
            [require('sequelize').Op.between]: [monthStart, monthEnd]
          }
        }
      });
      
      // Get real applications data for this month
      const applications = await Application.count({
        where: {
          applied_at: {
            [require('sequelize').Op.between]: [monthStart, monthEnd]
          }
        }
      });
      
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

    // Get courses distribution by type
    const coursesByType = await Course.findAll({
      attributes: [
        'course_type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['course_type'],
      raw: true
    });

    const coursesDistribution = coursesByType.map(item => ({
      name: item.course_type === 'video' ? 'Videos' : 
            item.course_type === 'book' ? 'Books' : 
            item.course_type === 'business_plan' ? 'Business Plans' : 
            item.course_type || 'Other',
      value: parseInt(item.count),
      color: item.course_type === 'video' ? '#3b82f6' : 
             item.course_type === 'book' ? '#16a34a' : 
             item.course_type === 'business_plan' ? '#8b5cf6' : '#64748b'
    }));

    // Get industry distribution for videos
    const videosByIndustry = await Course.findAll({
      attributes: [
        'industry_sector',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { course_type: 'video' },
      group: ['industry_sector'],
      raw: true
    });

    const videosIndustryDistribution = videosByIndustry.map(item => ({
      name: item.industry_sector || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Get industry distribution for books
    const booksByIndustry = await Course.findAll({
      attributes: [
        'industry_sector',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { course_type: 'book' },
      group: ['industry_sector'],
      raw: true
    });

    const booksIndustryDistribution = booksByIndustry.map(item => ({
      name: item.industry_sector || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Get industry distribution for business plans
    const businessPlansByIndustry = await Course.findAll({
      attributes: [
        'industry_sector',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { course_type: 'business_plan' },
      group: ['industry_sector'],
      raw: true
    });

    const businessPlansIndustryDistribution = businessPlansByIndustry.map(item => ({
      name: item.industry_sector || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Get industry distribution for jobs
    const jobsByIndustry = await Job.findAll({
      attributes: [
        'industry',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['industry'],
      raw: true
    });

    const jobsIndustryDistribution = jobsByIndustry.map(item => ({
      name: item.industry || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Get industry distribution for tenders
    const tendersByIndustry = await Tender.findAll({
      attributes: [
        'sector',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['sector'],
      raw: true
    });

    const tendersIndustryDistribution = tendersByIndustry.map(item => ({
      name: item.sector || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Get industry distribution for opportunities
    const opportunitiesByIndustry = await Opportunity.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    const opportunitiesIndustryDistribution = opportunitiesByIndustry.map(item => ({
      name: item.category || 'Other',
      value: parseInt(item.count),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // User activity data
    const userActivity = [
      { status: 'Active Users', count: activeUsers, color: '#16a34a' },
      { status: 'Pending Approval', count: pendingApprovals, color: '#f59e0b' },
      { status: 'Inactive', count: totalUsers - activeUsers - pendingApprovals, color: '#ef4444' }
    ];

    // Daily stats (last 7 days) - using real data
    const dailyStats = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const [jobsCount, tendersCount, opportunitiesCount] = await Promise.all([
        Job.count({
          where: {
            created_at: {
              [require('sequelize').Op.between]: [dayStart, dayEnd]
            }
          }
        }),
        Tender.count({
          where: {
            created_at: {
              [require('sequelize').Op.between]: [dayStart, dayEnd]
            }
          }
        }),
        Opportunity.count({
          where: {
            created_at: {
              [require('sequelize').Op.between]: [dayStart, dayEnd]
            }
          }
        })
      ]);
      
      dailyStats.push({
        day: days[6 - i],
        jobs: jobsCount,
        tenders: tendersCount,
        opportunities: opportunitiesCount
      });
    }

    // Status distribution data - using real counts
    const jobsStatusDistribution = [
      { name: 'Active', value: activeJobs, color: '#16a34a' },
      { name: 'Expired', value: expiredJobs, color: '#ef4444' },
      { name: 'Rejected', value: rejectedJobs, color: '#dc2626' },
      { name: 'Pending', value: pendingJobs, color: '#f59e0b' }
    ];

    const tendersStatusDistribution = [
      { name: 'Active', value: activeTenders, color: '#16a34a' },
      { name: 'Expired', value: expiredTenders, color: '#ef4444' },
      { name: 'Rejected', value: rejectedTenders, color: '#dc2626' },
      { name: 'Pending', value: pendingTenders, color: '#f59e0b' }
    ];

    const opportunitiesStatusDistribution = [
      { name: 'Active', value: activeOpportunities, color: '#16a34a' },
      { name: 'Expired', value: expiredOpportunities, color: '#ef4444' },
      { name: 'Rejected', value: rejectedOpportunities, color: '#dc2626' },
      { name: 'Pending', value: pendingOpportunities, color: '#f59e0b' }
    ];

    const applicationsStatusDistribution = [
      { name: 'Approved', value: approvedApplications, color: '#16a34a' },
      { name: 'Shortlisted', value: shortlistedApplications, color: '#3b82f6' },
      { name: 'Rejected', value: rejectedApplications, color: '#ef4444' }
    ];

    // Generate recent activity data
    const recentActivity = [];
    
    // Add recent users
    recentUsers.forEach(user => {
      const timeAgo = getTimeAgo(user.created_at);
      const userType = user.user_type || 'user';
      recentActivity.push({
        type: 'user_registration',
        message: `New ${userType} registered: ${user.first_name} ${user.last_name}`,
        timeAgo,
        timestamp: user.created_at
      });
    });

    // Add recent applications
    recentApplications.forEach(app => {
      const timeAgo = getTimeAgo(app.applied_at);
      recentActivity.push({
        type: 'application',
        message: `New application submitted`,
        timeAgo,
        timestamp: app.applied_at
      });
    });

    // Add recent jobs, tenders, and opportunities
    const [recentJobs, recentTenders, recentOpportunities] = await Promise.all([
      Job.findAll({
        limit: 3,
        order: [['created_at', 'DESC']],
        attributes: ['title', 'company', 'created_at']
      }),
      Tender.findAll({
        limit: 3,
        order: [['created_at', 'DESC']],
        attributes: ['title', 'organization', 'created_at']
      }),
      Opportunity.findAll({
        limit: 3,
        order: [['created_at', 'DESC']],
        attributes: ['title', 'organization', 'created_at']
      })
    ]);

    recentJobs.forEach(job => {
      const timeAgo = getTimeAgo(job.created_at);
      recentActivity.push({
        type: 'job',
        message: `New job posted: ${job.title} at ${job.company}`,
        timeAgo,
        timestamp: job.created_at
      });
    });

    recentTenders.forEach(tender => {
      const timeAgo = getTimeAgo(tender.created_at);
      recentActivity.push({
        type: 'tender',
        message: `Tender submitted: ${tender.title}`,
        timeAgo,
        timestamp: tender.created_at
      });
    });

    recentOpportunities.forEach(opportunity => {
      const timeAgo = getTimeAgo(opportunity.created_at);
      recentActivity.push({
        type: 'opportunity',
        message: `New opportunity added: ${opportunity.title}`,
        timeAgo,
        timestamp: opportunity.created_at
      });
    });

    // Sort by timestamp and take the most recent 10
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const topRecentActivity = recentActivity.slice(0, 10);

    // Calculate job seekers and employers based on your logic
    const jobSeekers = totalUsers; // All users are job seekers
    const employers = totalJobs; // Each job post = 1 employer

    const dashboardData = {
      stats: {
        totalUsers,
        totalJobs,
        totalTenders,
        totalOpportunities,
        totalCourses,
        totalApplications,
        totalRevenue: 0, // No revenue system implemented yet
        activeUsers,
        pendingApprovals,
        basicUsers,
        proUsers,
        enterpriseUsers,
        approvedApplications,
        shortlistedApplications,
        rejectedApplications,
        jobSeekers,
        employers
      },
      monthlySubscriptions,
      contentDistribution,
      userActivity,
      dailyStats,
      jobsStatusDistribution,
      tendersStatusDistribution,
      opportunitiesStatusDistribution,
      applicationsStatusDistribution,
      recentActivity: topRecentActivity,
      // New pie chart data
      coursesDistribution,
      videosIndustryDistribution,
      booksIndustryDistribution,
      businessPlansIndustryDistribution,
      jobsIndustryDistribution,
      tendersIndustryDistribution,
      opportunitiesIndustryDistribution
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

    // Check if email is already blocked, if not, block it
    const existingBlockedEmail = await BlockedEmail.findOne({ where: { email: user.email } });
    if (!existingBlockedEmail) {
      await BlockedEmail.create({
        email: user.email,
        reason: 'user_deleted',
        blocked_by: req.user.id,
        original_user_id: user.id,
        notes: `User account deleted by admin ${req.user.first_name} ${req.user.last_name}`
      });
    } else {
      // Update existing blocked email to remove the foreign key reference
      await existingBlockedEmail.update({
        original_user_id: null,
        notes: `User account deleted by admin ${req.user.first_name} ${req.user.last_name} (updated)`
      });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'DELETE_USER',
      resource_type: 'user',
      resource_id: req.params.id,
      description: `Deleted user: ${user.email}${existingBlockedEmail ? ' (email was already blocked)' : ' and blocked their email address'}`
    });

    // Delete the user
    await user.destroy();
    
    res.json({ 
      message: existingBlockedEmail 
        ? 'User deleted successfully (email was already blocked)' 
        : 'User deleted successfully and email has been blocked from future registrations',
      blockedEmail: user.email
    });
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

    console.log(`[ADMIN CONTENT] Fetching ${type} with whereClause:`, whereClause);
    const { count: total, rows: content } = await Model.findAndCountAll({
      where: whereClause,
      order,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
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
    
    console.log(`[ADMIN CONTENT] Fetched ${content.length} ${type} items from database`);
    if (type === 'jobs' && content.length > 0) {
      console.log(`[ADMIN CONTENT] Job IDs:`, content.map(j => j.id));
      console.log(`[ADMIN CONTENT] First job:`, {
        id: content[0].id,
        title: content[0].title,
        company: content[0].company,
        location: content[0].location,
        country: content[0].country
      });
    }

    // Transform content to match mock data structure
    const transformedContent = content.map(item => {
      const baseItem = {
        id: item.id,
        title: item.title || 'Unknown Title',
        status: item.status || 'active',
        approval_status: item.approval_status || 'pending',
        createdAt: item.createdAt || item.created_at,
        updatedAt: item.updatedAt || item.updated_at,
        // Debug logging for dates
        debug_created_at: item.created_at,
        debug_createdAt: item.createdAt,
        postedBy: item.creator ? `${item.creator.first_name || ''} ${item.creator.last_name || ''}`.trim() || item.creator.email : 'Unknown',
        approvedBy: item.approver ? `${item.approver.first_name || ''} ${item.approver.last_name || ''}`.trim() || item.approver.email : null,
        approvedAt: item.approved_at,
        rejectionReason: item.rejection_reason,
        views: item.views_count || 0,
        applications: item.applications_count || 0,
        creator: item.creator ? {
          id: item.creator.id,
          name: `${item.creator.first_name || ''} ${item.creator.last_name || ''}`.trim() || item.creator.email,
          email: item.creator.email,
          phone: item.creator.phone
        } : null
      };

      // Add type-specific fields
      if (type === 'jobs') {
        // Debug logging for contact fields
        console.log(`[ADMIN CONTENT] Job ${item.id} contact fields:`, {
          contact_email: item.contact_email,
          contact_phone: item.contact_phone
        });
        
        return {
          ...baseItem,
          company: item.company || 'Unknown Company',
          location: item.location || 'Unknown Location',
          country: item.country || '',
          type: item.job_type || 'Full-time',
          experience: item.experience_years ? `${item.experience_years} years` : (item.experience_level ? item.experience_level.charAt(0).toUpperCase() + item.experience_level.slice(1) + ' level' : 'Not specified'),
          salary: item.salary_min && item.salary_max ? 
                  `${item.currency} ${item.salary_min} - ${item.currency} ${item.salary_max}` : 
                  'Salary not specified',
          industry: item.industry || 'Unknown',
          benefits: Array.isArray(item.benefits) ? item.benefits : (item.benefits ? [item.benefits] : []),
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
          external_url: item.external_url || '',
          contact_email: item.contact_email || '',
          contact_phone: item.contact_phone || '',
          logo: resolveAssetUrl(item.company_logo) || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop',
          urgentHiring: item.is_urgent || false,
          isRemote: item.work_type === 'remote',
          description: item.description || '',
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
                  salary_min: item.salary_min,
        salary_max: item.salary_max,
        currency: item.currency || 'USD',
        job_type: item.job_type,
        experience_level: item.experience_level,
        experience_years: item.experience_years,
        work_type: item.work_type,
        is_urgent: item.is_urgent,
        company_logo: item.company_logo,
          application_deadline: item.application_deadline,
        price: item.price || 'Free'
        };
        
        // Debug the final job data
        const finalJobData = {
          ...baseItem,
          company: item.company || 'Unknown Company',
          location: item.location || 'Unknown Location',
          country: item.country || '',
          type: item.job_type || 'Full-time',
          experience: item.experience_years ? `${item.experience_years} years` : (item.experience_level ? item.experience_level.charAt(0).toUpperCase() + item.experience_level.slice(1) + ' level' : 'Not specified'),
          salary: item.salary_min && item.salary_max ? 
                  `${item.currency} ${item.salary_min} - ${item.currency} ${item.salary_max}` : 
                  'Salary not specified',
          industry: item.industry || 'Unknown',
          benefits: Array.isArray(item.benefits) ? item.benefits : (item.benefits ? [item.benefits] : []),
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
          external_url: item.external_url || '',
          contact_email: item.contact_email || '',
          contact_phone: item.contact_phone || '',
          logo: resolveAssetUrl(item.company_logo) || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop',
          urgentHiring: item.is_urgent || false,
          isRemote: item.work_type === 'remote',
          description: item.description || '',
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
                  salary_min: item.salary_min,
        salary_max: item.salary_max,
        currency: item.currency || 'USD',
        job_type: item.job_type,
        experience_level: item.experience_level,
        experience_years: item.experience_years,
        work_type: item.work_type,
        is_urgent: item.is_urgent,
        company_logo: item.company_logo,
          application_deadline: item.application_deadline,
        price: item.price || 'Free'
        };
        
        console.log(`[ADMIN CONTENT] Final job data for ${item.id}:`, {
          contact_email: finalJobData.contact_email,
          contact_phone: finalJobData.contact_phone
        });
        
        return finalJobData;
      } else if (type === 'tenders') {
        return {
          ...baseItem,
          organization: item.organization || 'Unknown Organization',
          location: item.location || 'Unknown Location',
          country: getCountryName(item.country) || 'Unknown',
          sector: item.sector || 'Unknown',
          category: item.category || 'Unknown',
          contract_value_min: item.contract_value_min || null,
          contract_value_max: item.contract_value_max || null,
          currency: item.currency || 'USD',
          contractValue: (() => {
            const min = item.contract_value_min;
            const max = item.contract_value_max;
            const currency = item.currency || 'USD';
            
            if (min != null && max != null) {
              // Both values present
              if (min === max) {
                // Fixed value
                return `${currency} ${Math.round(min).toLocaleString()}`;
              } else {
                // Value range
                return `${currency} ${Math.round(min).toLocaleString()} - ${currency} ${Math.round(max).toLocaleString()}`;
              }
            } else if (min != null) {
              // Only min value (fixed value)
              return `${currency} ${Math.round(min).toLocaleString()}`;
            } else if (max != null) {
              // Only max value (unusual case)
              return `${currency} ${Math.round(max).toLocaleString()}`;
            } else {
              return 'Value not specified';
            }
          })(),
          duration: item.duration || 'Not specified',
          deadline: item.deadline,
          submissions: item.submissions_count || 0,
          coverImage: resolveAssetUrl(item.cover_image) || null,
          description: item.description || '',
          tags: (() => {
            const tags = item.tags || [];
            console.log('Admin controller - Tender tags for', item.title, ':', tags);
            return tags;
          })(),
          price: item.price || 'Free',
          // Detailed tender fields
          requirements: item.requirements || [],
          submission_process: item.submission_process || [],
          evaluation_criteria: item.evaluation_criteria || [],
          contact_email: item.contact_email || null,
          contact_phone: item.contact_phone || null,
          external_url: item.external_url || null
        };
      } else if (type === 'opportunities') {
        return {
          ...baseItem,
          organization: item.organization || 'Unknown Organization',
          location: item.location || 'Unknown Location',
          type: item.type || 'Opportunity',
          opportunityType: item.type || 'Opportunity', // Store display value directly
          content_type: 'opportunities', // Add content type for frontend
          category: item.category || 'Unknown',
          amount: item.amount_min && item.amount_max ? 
                  `${item.currency} ${item.amount_min} - ${item.currency} ${item.amount_max}` : 
                  'Amount not specified',
          amount_min: item.amount_min,
          amount_max: item.amount_max,
          salaryMin: item.amount_min, // Add salaryMin for frontend compatibility
          salaryMax: item.amount_max, // Add salaryMax for frontend compatibility
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
          eligibility: (() => {
            try {
              if (typeof item.eligibility_criteria === 'string') {
                return JSON.parse(item.eligibility_criteria);
              }
              return Array.isArray(item.eligibility_criteria) ? item.eligibility_criteria : [];
            } catch (e) {
              return [];
            }
          })(),
          requirements: (() => {
            try {
              if (typeof item.eligibility_criteria === 'string') {
                return JSON.parse(item.eligibility_criteria);
              }
              return Array.isArray(item.eligibility_criteria) ? item.eligibility_criteria : [];
            } catch (e) {
              return [];
            }
          })(),
          applicationProcess: (() => {
            try {
              if (typeof item.application_process === 'string') {
                return JSON.parse(item.application_process);
              }
              return Array.isArray(item.application_process) ? item.application_process : [];
            } catch (e) {
              return [];
            }
          })(),
          benefits: (() => {
            try {
              if (typeof item.benefits === 'string') {
                return JSON.parse(item.benefits);
              }
              return Array.isArray(item.benefits) ? item.benefits : [];
            } catch (e) {
              return [];
            }
          })(),
          requirements: (() => {
            try {
              if (typeof item.requirements === 'string') {
                return JSON.parse(item.requirements);
              }
              return Array.isArray(item.requirements) ? item.requirements : [];
            } catch (e) {
              return [];
            }
          })(),
          tags: (() => {
            try {
              if (typeof item.tags === 'string') {
                return JSON.parse(item.tags);
              }
              return Array.isArray(item.tags) ? item.tags : [];
            } catch (e) {
              return [];
            }
          })(),
          amount_min: item.amount_min,
          amount_max: item.amount_max,
          currency: item.currency || 'USD',
          organization_logo: item.organization_logo,
          external_url: item.external_url,
          contact_email: item.contact_email,
          documents: (() => {
            try {
              if (typeof item.documents === 'string') {
                return JSON.parse(item.documents);
              }
              return Array.isArray(item.documents) ? item.documents : [];
            } catch (e) {
              return [];
            }
          })(),
          price: item.price || 'Free'
        };
      } else if (type === 'courses') {
        return {
          ...baseItem,
          category: item.category || item.subcategory || null,
          instructor: item.instructor || 'Unknown Instructor',
          course_type: item.course_type || item.type || 'video',
          duration: item.duration || item.duration_hours || 'Not specified',
          duration_hours: item.duration_hours || null,
          duration_minutes: item.duration_minutes || null,
          level: item.level || 'Beginner',
          rating: item.rating || 4.5,
          students: item.enrollment_count || item.studentsCount || Math.floor(Math.random() * 1000),
          thumbnail_url: item.thumbnail_url || item.thumbnail || null,
          video_url: item.video_url || null,
          download_url: item.download_url || null,
          description: item.description || '',
          learning_objectives: item.learning_objectives || [],
          language: item.language || 'English',
          // Additional course fields needed by admin UI
          format: item.format || null,
          business_type: item.business_type || null,
          industry_sector: item.industry_sector || null,
          stage: item.stage || null,
          page_count: item.page_count != null ? item.page_count : null,
          file_size: item.file_size || null,
          author_type: item.author_type || null,
          target_audience: item.target_audience || null,
          downloads: item.downloads || 0,
          isPro: item.is_free === false,
          price: item.is_free ? 'Free' : 'Pro'
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
    console.log(`Attempting to delete ${type} with id: ${id}`);

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

    console.log(`Found content: ${content.title || content.name}`);

    // Try to log admin action, but don't fail if it doesn't work
    try {
      // Convert plural type to singular for AdminLog
      const logResourceType = type === 'jobs' ? 'job' : 
                             type === 'tenders' ? 'tender' : 
                             type === 'opportunities' ? 'opportunity' : 
                             type === 'courses' ? 'course' : type;
      
      await AdminLog.create({
        admin_id: req.user.id,
        action: 'DELETE_CONTENT',
        resource_type: logResourceType,
        resource_id: id,
        description: `Deleted ${type}: ${content.title || content.name}`
      });
      console.log('Admin log created successfully');
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
      // Continue with deletion even if logging fails
    }

    // Delete the content
    await content.destroy();
    console.log('Content deleted successfully');
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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

    // Minimal update to avoid DB column mismatch errors
    await content.update({
      approval_status: 'approved'
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

    if (type === 'courses') {
      // Map string Free/Pro to boolean is_free and clear numeric price
      const isFree = String(price).toLowerCase() === 'free';
      await content.update({ is_free: isFree, price: null });
    } else {
      await content.update({ price });
    }

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
        { 
          model: User, 
          as: 'applicant', 
          required: false,
          attributes: { exclude: ['password_hash'] }
        },
        { model: Job, as: 'job', required: false },
        { model: Tender, as: 'tender', required: false },
        { model: Opportunity, as: 'opportunity', required: false }
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
        user_id: app.user_id,
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
        applicantUsername: app.applicant?.username || '',
        applicantProfileImage: app.applicant?.profile_image ? resolveAssetUrl(app.applicant.profile_image) : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
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
    console.log('🔍 getApplicationsOverview called');
    // Pull latest 50 of each with counts; adjust as needed via query
    const limit = parseInt(req.query.limit, 10) || 50;

    const [jobs, tenders, opportunities] = await Promise.all([
      Job.findAll({
        where: {
          approval_status: 'approved',
          status: 'active'
        },
        order: [['createdAt', 'DESC']],
        limit,
          include: [
            {
          model: Application,
          as: 'applications',
          attributes: ['id'],
          required: false
            },
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
              required: false
            }
          ]
      }),
      Tender.findAll({
        where: {
          approval_status: 'approved',
          status: 'active'
        },
        order: [['createdAt', 'DESC']],
        limit,
        include: [
          {
            model: Application,
            as: 'applications',
            attributes: ['id'],
            required: false
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
            required: false
          }
        ]
      }),
      Opportunity.findAll({
        where: {
          approval_status: 'approved',
          status: 'active'
        },
        order: [['createdAt', 'DESC']],
        limit,
        include: [
          {
            model: Application,
            as: 'applications',
            attributes: ['id'],
            required: false
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
            required: false
          }
        ]
      })
    ]);

    console.log('🔍 Raw opportunities from DB:', opportunities.map(o => ({
      id: o.id,
      title: o.title,
      external_url: o.external_url
    })));

    const mapJob = (j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        industry: j.industry,
        location: j.location,
        country: j.country,
        type: j.job_type,
        experience: j.experience_level,
        salary: j.salary_min && j.salary_max ? `${j.currency} ${j.salary_min} - ${j.currency} ${j.salary_max}` : 'Salary not specified',
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        currency: j.currency,
        postedTime: j.createdAt,
        application_deadline: j.application_deadline || null,
        applicants: j.applications ? j.applications.length : (j.applications_count || 0),
        description: j.description || '',
        skills: Array.isArray(j.skills) ? j.skills : [],
        benefits: j.benefits || [],
        external_url: j.external_url,
        contact_email: j.contact_email,
        contact_phone: j.contact_phone,
        logo: resolveAssetUrl(j.company_logo),
        urgentHiring: !!j.is_urgent,
        isRemote: j.work_type === 'remote',
        postedBy: j.posted_by || 'platform',
        price: j.price || 'Free',
        status: j.status && j.status.charAt(0).toUpperCase() + j.status.slice(1),
        creator: j.creator ? {
          name: j.creator.first_name && j.creator.last_name ? 
            `${j.creator.first_name} ${j.creator.last_name}`.trim() : 
            (j.creator.first_name || j.creator.last_name || 'Unknown'),
          email: j.creator.email,
        phone: j.creator.phone
      } : null
    });

    const mapTender = (t) => ({
      id: t.id,
      title: t.title,
      company: t.organization,
      industry: t.sector,
      location: t.location,
      country: t.country,
      budget: t.contract_value_min && t.contract_value_max ? `${t.currency} ${t.contract_value_min} - ${t.currency} ${t.contract_value_max}` : 'Value not specified',
      deadline: t.deadline || null,
      postedTime: t.createdAt,
      applicants: t.applications ? t.applications.length : (t.submissions_count || 0),
      description: t.description || '',
      requirements: Array.isArray(t.requirements) ? t.requirements : [],
      project_scope: Array.isArray(t.project_scope) ? t.project_scope : [],
      technical_requirements: Array.isArray(t.technical_requirements) ? t.technical_requirements : [],
      submission_process: Array.isArray(t.submission_process) ? t.submission_process : [],
      evaluation_criteria: Array.isArray(t.evaluation_criteria) ? t.evaluation_criteria : [],
      logo: resolveAssetUrl(t.organization_logo),
      coverImage: resolveAssetUrl(t.cover_image),
      external_url: t.external_url,
      postedBy: t.creator ? 
        `${t.creator.first_name || ''} ${t.creator.last_name || ''}`.trim() || 'Unknown' : 
        'platform',
      contactEmail: t.creator ? t.creator.email : '',
      contactPhone: t.creator ? t.creator.phone : '',
      status: t.status && t.status.charAt(0).toUpperCase() + t.status.slice(1),
      creator: t.creator ? {
        name: t.creator.first_name && t.creator.last_name ? 
          `${t.creator.first_name} ${t.creator.last_name}`.trim() : 
          (t.creator.first_name || t.creator.last_name || 'Unknown'),
        email: t.creator.email,
        phone: t.creator.phone
      } : null
    });

    const mapOpportunity = (o) => ({
      id: o.id,
      title: o.title,
      company: o.organization,
      industry: o.category,
      type: o.type,
      location: o.location || o.country || 'Remote',
      country: o.country,
      duration: o.duration || '',
      stipend: (() => {
        const min = o.amount_min;
        const max = o.amount_max;
        const currency = o.currency || 'USD';
        
        if (min != null && max != null) {
          // Convert to numbers for proper comparison
          const minNum = parseFloat(min);
          const maxNum = parseFloat(max);
          return minNum === maxNum ? `${currency} ${minNum}` : `${currency} ${minNum} - ${currency} ${maxNum}`;
        } else if (min != null) {
          return `${currency} ${min}`;
        } else if (max != null) {
          return `${currency} ${max}`;
        }
        return 'Amount not specified';
      })(),
      postedTime: o.createdAt,
      deadline: o.deadline || null,
      applicants: o.applications ? o.applications.length : (o.applications_count || 0),
      description: o.description || '',
      benefits: (() => {
        try {
          if (typeof o.benefits === 'string') {
            return JSON.parse(o.benefits);
          }
          return Array.isArray(o.benefits) ? o.benefits : [];
        } catch (e) {
          return [];
        }
      })(),
      requirements: (() => {
        try {
          if (typeof o.requirements === 'string') {
            return JSON.parse(o.requirements);
          }
          return Array.isArray(o.requirements) ? o.requirements : [];
        } catch (e) {
          return [];
        }
      })(),
      eligibility: (() => {
        try {
          if (typeof o.eligibility_criteria === 'string') {
            return JSON.parse(o.eligibility_criteria);
          }
          return Array.isArray(o.eligibility_criteria) ? o.eligibility_criteria : [];
        } catch (e) {
          return [];
        }
      })(),
      applicationProcess: Array.isArray(o.applicationProcess) ? o.applicationProcess : [],
      logo: resolveAssetUrl(o.organization_logo) || '',
      contact_email: o.contact_email,
      external_url: o.external_url,
      postedBy: o.creator ? 
        `${o.creator.first_name || ''} ${o.creator.last_name || ''}`.trim() || 'Unknown' : 
        'platform',
      contactEmail: o.contact_email || (o.creator ? o.creator.email : ''),
      contactPhone: o.creator ? o.creator.phone : '',
      status: o.status && o.status.charAt(0).toUpperCase() + o.status.slice(1),
      creator: o.creator ? {
        name: o.creator.first_name && o.creator.last_name ? 
          `${o.creator.first_name} ${o.creator.last_name}`.trim() : 
          (o.creator.first_name || o.creator.last_name || 'Unknown'),
        email: o.creator.email,
        phone: o.creator.phone
      } : null
    });

    const mappedOpportunities = opportunities.map(mapOpportunity);
    console.log('First opportunity mapped:', mappedOpportunities[0] ? { id: mappedOpportunities[0].id, title: mappedOpportunities[0].title, type: mappedOpportunities[0].type } : 'No opportunities');
    
    res.json({
      jobs: jobs.map(mapJob),
      tenders: tenders.map(mapTender),
      opportunities: mappedOpportunities
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
      include: [
        { model: User, as: 'applicant', required: false },
        { model: Job, as: 'job', required: false },
        { model: Tender, as: 'tender', required: false },
        { model: Opportunity, as: 'opportunity', required: false }
      ]
    });

    const toTitle = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

// Text processing and grammar correction functions
const processText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';
  
  return rawText
    .replace(/\b(i|we|you)\b/gi, (match) => match.toLowerCase())
    .replace(/\b(am|is|are|was|were)\b/gi, (match) => match.toLowerCase())
    .replace(/\.{2,}/g, '.') // Fix multiple periods
    .replace(/\s+/g, ' ') // Fix multiple spaces
    .replace(/^\s*[.!?]\s*/g, '') // Remove leading punctuation
    .replace(/\s*[.!?]\s*$/g, '.') // Ensure proper ending punctuation
    .trim();
};

// Helper function to extract skill names from various data structures
const extractSkillNames = (skills) => {
  if (!skills) return 'key technical skills';
  
  if (Array.isArray(skills)) {
    return skills.map(skill => {
      if (typeof skill === 'string') return skill;
      if (typeof skill === 'object' && skill !== null) {
        return skill.name || skill.title || skill.skill || 'Technical Skill';
      }
      return 'Technical Skill';
    }).slice(0, 3).join(', ');
  }
  
  if (typeof skills === 'string') {
    return skills;
  }
  
  return 'technical skills';
};

const generateProfessionalStatement = (data, type) => {
  switch(type) {
    case 'background':
      const industry = data.industry || 'various fields';
      const skills = extractSkillNames(data.skills);
      return `With a solid background in ${industry} and proven expertise in ${skills}`;
    
    case 'experience':
      const company = data.company || 'previous organizations';
      const achievement = data.achievement || 'delivered significant results and contributed to team success';
      return `In my previous role at ${company}, I ${achievement}`;
    
    case 'skills':
      const skillList = extractSkillNames(data.skills);
      return `This experience sharpened my abilities in ${skillList}`;
    
    case 'motivation':
      const companyName = data.companyName || 'this organization';
      const reason = data.reason || 'the innovative approach and commitment to excellence';
      return `What excites me most about joining ${companyName} is ${reason}`;
    
    default:
      return '';
  }
};

const extractKeyAchievement = (experience) => {
  if (!Array.isArray(experience) || experience.length === 0) return 'delivered significant results and contributed to team success';
  
  // Look for experience with descriptions or achievements
  const expWithDescription = experience.find(exp => exp.description && exp.description.length > 20);
  if (expWithDescription) {
    const desc = processText(expWithDescription.description);
    // Extract key phrases and make them more professional
    if (desc.includes('led') || desc.includes('managed') || desc.includes('developed')) {
      return desc;
    }
  }
  
  // Fallback to company-based achievement
  const recentExp = experience[0];
  const company = recentExp?.company || 'my previous organization';
  return `delivered measurable results and contributed to organizational success`;
};

// Generate cover letter from user profile data
const generateCoverLetter = (user, application) => {
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const currentRole = user.current_job_title || 'Professional';
  const industry = user.industry || 'various industries';
  const yearsExp = user.years_experience || 'several years';
  const location = user.location || 'my location';
  const phone = user.phone || 'Not provided';
  const email = user.email || 'Not provided';
  const nationality = user.nationality || 'Not specified';
  const languages = user.languages || 'Not specified';
  const employmentStatus = user.employment_status || 'Not specified';
  
  // Process skills with better handling
  const skills = Array.isArray(user.skills) ? 
    user.skills.map(skill => 
      typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Skill'
    ).join(', ') : 'Not specified';
  
  // Process education data with comprehensive details in descending order
  const education = Array.isArray(user.education) && user.education.length > 0 ? user.education : [];
  
  // Helper function to get education level hierarchy
  const getEducationLevel = (level) => {
    if (!level) return 0;
    const levelLower = level.toLowerCase();
    if (levelLower.includes('phd') || levelLower.includes('doctorate') || levelLower.includes('doctor')) return 7;
    if (levelLower.includes('master') || levelLower.includes('ms') || levelLower.includes('ma') || 
        levelLower.includes('mba') || levelLower.includes('mfa') || levelLower.includes('m.ed')) return 6;
    if (levelLower.includes('bachelor') || levelLower.includes('bs') || levelLower.includes('ba') || 
        levelLower.includes('bsc') || levelLower.includes('b.eng') || levelLower.includes('b.com')) return 5;
    if (levelLower.includes('associate') || levelLower.includes('aa') || levelLower.includes('as')) return 4;
    if (levelLower.includes('diploma') || levelLower.includes('certificate')) return 3;
    if (levelLower.includes('high school') || levelLower.includes('secondary') || 
        levelLower.includes('hsc') || levelLower.includes('a level')) return 2;
    if (levelLower.includes('ordinary level') || levelLower.includes('o level')) return 1.5;
    return 1;
  };
  
  // Sort education by level in descending order (highest first)
  const sortedEducation = [...education].sort((a, b) => {
    const levelA = getEducationLevel(a.level || '');
    const levelB = getEducationLevel(b.level || '');
    return levelB - levelA;
  });
  
  // Get highest education for cover letter summary
  const highestEducation = education.length > 0 ? education.reduce((highest, current) => {
    const currentLevel = getEducationLevel(current.level || '');
    const highestLevel = getEducationLevel(highest.level || '');
    return currentLevel > highestLevel ? current : highest;
  }) : null;
  
  const educationSummary = highestEducation ? 
    `${highestEducation.level || 'Education'}${highestEducation.program || highestEducation.major || highestEducation.field || highestEducation.subject ? ` in ${highestEducation.program || highestEducation.major || highestEducation.field || highestEducation.subject}` : ''} from ${highestEducation.institution || highestEducation.school || highestEducation.university || 'Institution'}` : 
    '';
  
  // Process all experiences for cover letter summary
  const experience = Array.isArray(user.experience) && user.experience.length > 0 ? user.experience : [];
  
  // Calculate experience per industry
  const calculateExperienceByIndustry = (experienceArray) => {
    if (!Array.isArray(experienceArray) || experienceArray.length === 0) return {};
    
    const industryExperience = {};
    
    experienceArray.forEach(exp => {
      if (exp.startYear && exp.startMonth) {
        const startDate = new Date(parseInt(exp.startYear), parseInt(exp.startMonth) - 1);
        const endDate = exp.isCurrent 
          ? new Date() 
          : (exp.endYear && exp.endMonth) 
            ? new Date(parseInt(exp.endYear), parseInt(exp.endMonth) - 1)
            : new Date();
        
        if (endDate >= startDate) {
          const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - startDate.getMonth());
          const years = Math.floor(monthsDiff / 12);
          
          const expIndustry = exp.industry || industry;
          if (!industryExperience[expIndustry]) {
            industryExperience[expIndustry] = 0;
          }
          industryExperience[expIndustry] += years;
        }
      }
    });
    
    return industryExperience;
  };

  const industryExperience = calculateExperienceByIndustry(experience);
  
        // Get the job's industry to match against user's experience
      const jobData = application.job || null;
      const tenderData = application.tender || null;
      const opportunityData = application.opportunity || null;
      const jobIndustry = jobData?.industry || tenderData?.sector || opportunityData?.category || 'General';
      
      // Check if user has experience in the SAME industry as the job
      const hasJobIndustryExperience = industryExperience[jobIndustry] && industryExperience[jobIndustry] > 0;
      const jobIndustryYears = hasJobIndustryExperience ? industryExperience[jobIndustry] : 0;
      
      // Only mention industry experience if user has worked in the SAME industry as the job
      const primaryIndustry = hasJobIndustryExperience ? jobIndustry : null;
      const primaryIndustryYears = hasJobIndustryExperience ? jobIndustryYears : 0;
  
  // Create detailed work experience summary for the cover letter - show ALL experience
  const relevantExperience = experience;
  
  const workExperienceDetails = relevantExperience.length > 0 ? 
    relevantExperience.map(exp => {
      const position = exp.position || exp.job_title || exp.title || 'Professional';
      const company = exp.company || exp.organization || exp.employer || 'Company';
      return `${position} at ${company}`;
    }).join(', ') : '';

  // Create industry-specific experience summary for cover letter - only relevant industry
  const industryExperienceSummary = relevantExperience.length > 0 ? 
    relevantExperience.map(exp => {
      const position = exp.position || exp.job_title || exp.title || 'Professional';
      const company = exp.company || exp.organization || exp.employer || 'Company';
      return `${position} at ${company}`;
    }).join(', ') + (primaryIndustryYears > 0 ? ` with ${primaryIndustryYears} of experience in the ${primaryIndustry} industry` : '') :
    '';
  
  // Process certificates data - simplified
  const certificates = Array.isArray(user.certificates) && user.certificates.length > 0 ? user.certificates : [];
  const certificatesSummary = certificates.map(cert => {
    const name = cert.name || cert.title || cert.certificate_name || 'Certificate';
    const issuer = cert.issuer || cert.issuing_organization || cert.organization || 'Issuer';
    return `${name} from ${issuer}`;
  }).join(', ');
  
  // Get job/tender/opportunity details for personalized cover letter
  let positionTitle = 'this position';
  let companyName = 'your organization';
  let jobDescription = '';
  let requirements = '';
  
  if (application.job) {
    positionTitle = application.job.title || positionTitle;
    companyName = application.job.company || companyName;
    jobDescription = application.job.description || '';
    requirements = application.job.requirements || '';
  } else if (application.tender) {
    positionTitle = application.tender.title || positionTitle;
    companyName = application.tender.organization || companyName;
    jobDescription = application.tender.description || '';
    requirements = application.tender.requirements || '';
  } else if (application.opportunity) {
    positionTitle = application.opportunity.title || positionTitle;
    companyName = application.opportunity.organization || companyName;
    jobDescription = application.opportunity.description || '';
    requirements = application.opportunity.requirements || '';
  }
  
  // Ensure requirements is a string before calling substring
  if (requirements && typeof requirements !== 'string') {
    requirements = String(requirements);
  }
  
  // Ensure jobDescription is a string before calling substring
  if (jobDescription && typeof jobDescription !== 'string') {
    jobDescription = String(jobDescription);
  }

  // Generate professional statements using algorithms
  // Only mention industry background if user has experience in that specific industry
  const backgroundStatement = hasJobIndustryExperience ? 
    generateProfessionalStatement({
      industry: jobIndustry,
      skills: user.skills
    }, 'background') :
    generateProfessionalStatement({
      industry: 'various fields',
      skills: user.skills
    }, 'background');

      // Create a comprehensive experience statement for multiple roles
    const experienceStatement = experience.length > 0 ? 
      (() => {
        if (experience.length === 1) {
          const exp = experience[0];
          const company = exp.company || 'my previous organization';
          const achievement = processText(extractKeyAchievement(experience));
          return `In my previous role at ${company}, I ${achievement}`;
        } else {
          // Multiple experiences - create a summary
          const recentExp = experience[0];
          const company = recentExp.company || 'my previous organization';
          const totalRoles = experience.length;
          const industries = [...new Set(experience.map(exp => exp.industry).filter(Boolean))];
          const industryText = industries.length > 0 ? ` across ${industries.join(', ')} industries` : '';
          
          const achievement = processText(extractKeyAchievement(experience));
          return `Through my ${totalRoles} previous roles${industryText}, including my most recent position at ${company}, I ${achievement}`;
        }
      })() : 
      (() => {
        const achievement = processText(extractKeyAchievement(experience));
        return `I ${achievement}`;
      })();

  // Create a comprehensive skills statement that reflects diverse experience
  const skillsStatement = experience.length > 1 ? 
    (() => {
      const skillList = extractSkillNames(user.skills);
      const industries = [...new Set(experience.map(exp => exp.industry).filter(Boolean))];
      const industryText = industries.length > 1 ? ` across multiple industries` : '';
      
      return `This diverse experience${industryText} has sharpened my abilities in ${skillList}`;
    })() :
    generateProfessionalStatement({
      skills: user.skills
    }, 'skills');

  const motivationStatement = generateProfessionalStatement({
    companyName: companyName,
    reason: 'the innovative approach and commitment to excellence'
  }, 'motivation');

  // Professional cover letter template
  const coverLetter = `${name}
${location}
${email} | ${phone}
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear Hiring Manager,

I am writing to express my strong interest in the ${positionTitle} position at ${companyName}, as advertised on Merit Platform. ${backgroundStatement}, I am confident in my ability to make a valuable contribution to your team.

${experienceStatement}. ${skillsStatement} and strengthened my capacity to collaborate across teams and adapt quickly to challenges.

${motivationStatement}. I believe my skills in ${extractSkillNames(user.skills)} align well with your mission and would enable me to contribute meaningfully to your goals.

${educationSummary ? `I hold a ${processText(educationSummary)}.` : ''}

${certificatesSummary ? `I also hold the following certifications: ${processText(certificatesSummary)}.` : ''}

I would welcome the chance to discuss how my background and experience fit the needs of your team. Thank you for your time and consideration. I look forward to the possibility of contributing to ${companyName}'s success and am available at your earliest convenience for an interview.

Sincerely,
${name}`;

  return coverLetter;
};

// Generate academic summary from education data
const generateAcademicSummary = (education) => {
  if (!Array.isArray(education) || education.length === 0) {
    return 'No education information provided';
  }
  
  const summaries = education.map(edu => {
    const degree = edu.degree || edu.qualification || 'Degree';
    const field = edu.field || edu.major || edu.subject || 'field of study';
    const institution = edu.institution || edu.school || edu.university || 'institution';
    const year = edu.graduation_year || edu.year || edu.end_year || '';
    const gpa = edu.gpa || edu.grade || '';
    
    let summary = `${degree} in ${field} from ${institution}`;
    if (year) summary += ` (${year})`;
    if (gpa) summary += ` - GPA: ${gpa}`;
    
    return summary;
  });
  
  return summaries.join('; ');
};

// Generate experience summary from work experience data
const generateExperienceSummary = (experience) => {
  if (!Array.isArray(experience) || experience.length === 0) {
    return 'No work experience information provided';
  }
  
  const summaries = experience.map(exp => {
    const position = exp.position || exp.job_title || exp.title || 'Position';
    const company = exp.company || exp.organization || exp.employer || 'Company';
    const duration = exp.duration || exp.period || '';
    const description = exp.description || exp.responsibilities || '';
    
    let summary = `${position} at ${company}`;
    if (duration) summary += ` (${duration})`;
    if (description) summary += ` - ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`;
    
    return summary;
  });
  
  return summaries.join('; ');
};

// Generate certificates summary from certificates data
const generateCertificatesSummary = (certificates) => {
  if (!Array.isArray(certificates) || certificates.length === 0) {
    return 'No certificates information provided';
  }
  
  const summaries = certificates.map(cert => {
    const name = cert.name || cert.title || cert.certificate_name || 'Certificate';
    const issuer = cert.issuer || cert.issuing_organization || cert.organization || 'Issuer';
    const date = cert.issue_date || cert.date || cert.obtained_date || '';
    const expiry = cert.expiry_date || cert.expiration_date || '';
    
    let summary = `${name} from ${issuer}`;
    if (date) summary += ` (${date})`;
    if (expiry) summary += ` - Expires: ${expiry}`;
    
    return summary;
  });
  
  return summaries.join('; ');
};

// Process documents for download URLs
const processDocuments = (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    return [];
  }
  
  return documents.map(doc => {
    // Only use file_path since these are uploaded files, not URLs
    const filePath = doc.file_path || doc.certificate_file;
    
    return {
      id: doc.id || Math.random().toString(36).substr(2, 9),
      name: doc.name || doc.filename || doc.title || 'Document',
      type: doc.type || doc.file_type || 'application/pdf',
      size: doc.size || 'Unknown',
      file_path: filePath, // Only include the file path
      uploadedAt: doc.uploaded_at || doc.created_at || new Date().toISOString(),
      description: doc.description || ''
    };
  });
};

// Process certificates for display and download
const processCertificates = (certificates) => {
  if (!Array.isArray(certificates) || certificates.length === 0) {
    return [];
  }
  
  return certificates.map(cert => {
    // Only use file_path since these are uploaded files, not URLs
    const filePath = cert.file_path || cert.certificate_file;
    
    return {
      id: cert.id || Math.random().toString(36).substr(2, 9),
      name: cert.name || cert.title || cert.certificate_name || 'Certificate',
      issuer: cert.issuer || cert.issuing_organization || cert.organization || 'Issuer',
      issueDate: cert.issue_date || cert.date || cert.obtained_date || '',
      expiryDate: cert.expiry_date || cert.expiration_date || '',
      credentialId: cert.credential_id || cert.certificate_id || '',
      file_path: filePath, // Only include the file path
      description: cert.description || '',
      skills: cert.skills || [],
      verified: cert.verified || false
    };
  });
};

    const applicants = applications.map((app) => {
      const user = app.applicant || {};
      
      // Calculate profile completion percentage
      const profileFields = [
        'first_name', 'last_name', 'email', 'phone', 'profile_image', 'bio', 
        'location', 'country', 'skills', 'experience_level', 'industry', 
        'current_job_title', 'years_experience', 'employment_status', 
        'linkedin_url', 'education', 'experience', 'certificates'
      ];
      const completedFields = profileFields.filter(field => user[field] && user[field] !== '');
      const profileCompletion = Math.round((completedFields.length / profileFields.length) * 100);
      
      return {
        id: user.id || app.id,
        applicationId: app.id,
        name: user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Unknown',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        username: user.username || '',
        location: user.location || user.country || 'N/A',
        appliedDate: app.applied_at,
        status: app.status === 'accepted' ? 'approved' : (app.status || 'pending'),
        experience: toTitle(user.experience_level) || 'Not specified',
        yearsExperience: user.years_experience || 'Not specified',
        currentJobTitle: user.current_job_title || 'Not specified',
        industry: user.industry || 'Not specified',
        employmentStatus: toTitle(user.employment_status?.replace('-', ' ')) || 'Not specified',
        userType: toTitle(user.user_type?.replace('-', ' ')) || 'Not specified',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? 
          user.skills.map(skill => 
            typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Skill'
          ) : [],
        education: Array.isArray(user.education) ? user.education : [],
        workExperience: Array.isArray(user.experience) ? user.experience : [],
        certificates: Array.isArray(user.certificates) ? user.certificates : [],
        languages: user.languages || 'Not specified',
        linkedinUrl: user.linkedin_url || '',
        profileLinks: [
          { name: user.profile_link1_name, url: user.profile_link1_url },
          { name: user.profile_link2_name, url: user.profile_link2_url },
          { name: user.profile_link3_name, url: user.profile_link3_url }
        ].filter(link => link.name && link.url),
        nationality: user.nationality || 'Not specified',
        countryOfResidence: user.country_of_residence || 'Not specified',
        isVerified: user.is_verified || false,
        lastLogin: user.last_login,
        profileCompletion,
        avatar: user.profile_image || '',
        profileImage: user.profile_image ? resolveAssetUrl(user.profile_image) : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        coverLetter: generateCoverLetter(user, app),
        applicationData: app.application_data || {},
        documents: app.documents || [],
        maritalStatus: user.marital_status || 'Not specified',
        nationality: user.nationality || 'Not specified',
        countryOfResidence: user.country_of_residence || 'Not specified',
        dateOfBirth: user.date_of_birth || 'Not specified',
        gender: user.gender || 'Not specified',
        disabilityStatus: user.disability_status || 'Not specified',
        languages: user.languages || 'Not specified',
        
        // Profile links
        linkedinUrl: user.linkedin_url || '',
        profileLink1Name: user.profile_link1_name || '',
        profileLink1Url: user.profile_link1_url || '',
        profileLink2Name: user.profile_link2_name || '',
        profileLink2Url: user.profile_link2_url || '',
        profileLink3Name: user.profile_link3_name || '',
        profileLink3Url: user.profile_link3_url || '',
        
        // Documents and files with download URLs
        userDocuments: processDocuments(user.documents || []),
        applicationDocuments: processDocuments(app.documents || []),
        certificates: processCertificates(user.certificates || []),
        
        // Academic and professional summary
        academicSummary: generateAcademicSummary(user.education || []),
        experienceSummary: generateExperienceSummary(user.experience || []),
        certificatesSummary: generateCertificatesSummary(user.certificates || []),
        
        // Additional comprehensive data
        linkedinUrl: user.linkedin_url || '',
        profileLinks: [
          { name: user.profile_link1_name, url: user.profile_link1_url },
          { name: user.profile_link2_name, url: user.profile_link2_url },
          { name: user.profile_link3_name, url: user.profile_link3_url }
        ].filter(link => link.name && link.url),
        
        // Complete education array
        education: user.education || [],
        // Complete experience array
        experience: user.experience || [],
        // Complete certificates array
        certificates: user.certificates || [],
        // Complete skills array
        skills: Array.isArray(user.skills) ? 
          user.skills.map(skill => 
            typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Skill'
          ) : []
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
    // Map 'approved' to 'accepted' for database storage
    const dbStatus = status === 'approved' ? 'accepted' : status;
    app.status = dbStatus;
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

// Download document/certificate by file_path, streaming bytes with headers
const downloadDocument = async (req, res) => {
  try {
    const { documentId, userId } = req.params;

    // Note: route-level auth middleware may guard this. Do not hard-fail here to avoid cookie propagation issues.

    const user = await User.findByPk(userId, {
      attributes: ['id', 'first_name', 'last_name', 'documents', 'certificates']
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const docs = Array.isArray(user.documents) ? user.documents : [];
    const certs = Array.isArray(user.certificates) ? user.certificates : [];

    // IDs in DB may be strings or numbers; normalize to string for comparison
    let target = [...docs, ...certs].find(d => String(d.id || d._id) === String(documentId));

    // If not found on profile, search application documents for this user
    if (!target) {
      const userApps = await Application.findAll({
        where: { user_id: userId },
        attributes: ['id', 'documents']
      });
      for (const app of userApps) {
        let appDocs = [];
        try {
          appDocs = Array.isArray(app.documents) ? app.documents : (app.documents ? JSON.parse(app.documents) : []);
        } catch (e) {
          appDocs = [];
        }
        const found = appDocs.find(d => String(d.id || d._id) === String(documentId));
        if (found) {
          target = found;
          break;
        }
      }
    }
    if (!target) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const filePath = target.file_path || target.certificate_file;
    if (!filePath || !filePath.startsWith('/uploads/')) {
      return res.status(404).json({ success: false, message: 'File path not available' });
    }

    // Resolve absolute path on disk
    const absolutePath = path.join(__dirname, '../../', filePath.replace(/^\/+/, ''));
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    // Infer content type from extension (simple map)
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType =
      ext === '.pdf' ? 'application/pdf' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.doc' ? 'application/msword' :
      ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
      ext === '.xls' ? 'application/vnd.ms-excel' :
      ext === '.xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
      'application/octet-stream';

    const baseName = path.basename(absolutePath);
    const suggestedName = (target.name || target.title || baseName).replace(/\s+/g, '_');
    const finalName = suggestedName.toLowerCase().endsWith(ext) ? suggestedName : `${suggestedName}${ext}`;

    // Provide Content-Length to help some browsers/viewers
    try {
      const stats = fs.statSync(absolutePath);
      res.setHeader('Content-Length', stats.size);
    } catch {}
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${finalName}"`);

    const stream = fs.createReadStream(absolutePath);
    stream.on('error', (err) => {
      console.error('Stream error while sending file:', err);
      if (!res.headersSent) {
        res.status(500).end('Error reading file');
      } else {
        res.end();
      }
    });
    stream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ success: false, message: 'Error downloading document' });
  }
};

// Helper function to get time ago string
const getTimeAgo = (date) => {
  if (!date) return 'Recently';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
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
  updateApplicantStatus,
  downloadDocument
};

// Download by direct file path (query param ?path=/uploads/...)
module.exports.downloadByPath = async (req, res) => {
  try {
    const { path: pathQuery } = req.query;
    if (!pathQuery || typeof pathQuery !== 'string' || !pathQuery.startsWith('/uploads/')) {
      return res.status(400).json({ success: false, message: 'Invalid file path' });
    }

    const absolutePath = require('path').join(__dirname, '../../', pathQuery.replace(/^\/+/, ''));
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    const ext = require('path').extname(absolutePath).toLowerCase();
    const contentType =
      ext === '.pdf' ? 'application/pdf' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.doc' ? 'application/msword' :
      ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
      ext === '.xls' ? 'application/vnd.ms-excel' :
      ext === '.xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
      'application/octet-stream';

    const base = require('path').basename(absolutePath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${base}"`);

    try {
      const stats = fs.statSync(absolutePath);
      res.setHeader('Content-Length', stats.size);
    } catch {}
    fs.createReadStream(absolutePath).pipe(res);
  } catch (error) {
    console.error('Error downloading by path:', error);
    res.status(500).json({ success: false, message: 'Error downloading file' });
  }
};
