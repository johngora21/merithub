const { Job, User, Application } = require('../models');
const { Op } = require('sequelize');

const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      location,
      job_type,
      experience_level,
      work_type,
      industry,
      posted_by,
      status = 'active'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { 
      status,
      approval_status: 'approved'
    };

    // Build search conditions
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (location) whereClause.location = { [Op.like]: `%${location}%` };
    if (job_type) whereClause.job_type = job_type;
    if (experience_level) whereClause.experience_level = experience_level;
    if (work_type) whereClause.work_type = work_type;
    if (industry) whereClause.industry = { [Op.like]: `%${industry}%` };
    if (posted_by) whereClause.posted_by = posted_by;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await job.increment('views_count');

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      created_by: req.user.id,
      approval_status: 'pending'
    };

    // If a logo file was uploaded, save its served URL path
    if (req.file) {
      jobData.company_logo = `/uploads/images/${req.file.filename}`;
    }

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the creator or admin
    if (job.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.company_logo = `/uploads/images/${req.file.filename}`;
    }
    await job.update(updateData);

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the creator or admin
    if (job.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

const getJobStats = async (req, res) => {
  try {
    const stats = await Job.findAll({
      attributes: [
        'status',
        [Job.sequelize.fn('COUNT', Job.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: 'active' } });
    const totalViews = await Job.sum('views_count');
    const totalApplications = await Job.sum('applications_count');

    res.json({
      success: true,
      data: {
        total_jobs: totalJobs,
        active_jobs: activeJobs,
        total_views: totalViews || 0,
        total_applications: totalApplications || 0,
        jobs_by_status: stats
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
};
