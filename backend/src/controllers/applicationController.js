const { Application, User, Job, Tender, Opportunity } = require('../models');
const { Op } = require('sequelize');

const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      application_type,
      user_id
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (application_type) whereClause.application_type = application_type;
    if (user_id) whereClause.user_id = user_id;

    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company']
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'organization']
        },
        {
          model: Opportunity,
          as: 'opportunity',
          attributes: ['id', 'title', 'organization']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'location']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location']
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'organization', 'location']
        },
        {
          model: Opportunity,
          as: 'opportunity',
          attributes: ['id', 'title', 'organization', 'location']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

const createApplication = async (req, res) => {
  try {
    const { application_type, job_id, tender_id, opportunity_id, cover_letter, application_data, documents } = req.body;

    // Validate that only one type is provided
    const typeCount = [job_id, tender_id, opportunity_id].filter(Boolean).length;
    if (typeCount !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Exactly one of job_id, tender_id, or opportunity_id must be provided'
      });
    }

    // Check if user already applied
    let existingApplication;
    if (job_id) {
      existingApplication = await Application.findOne({
        where: { user_id: req.user.id, job_id }
      });
    } else if (tender_id) {
      existingApplication = await Application.findOne({
        where: { user_id: req.user.id, tender_id }
      });
    } else if (opportunity_id) {
      existingApplication = await Application.findOne({
        where: { user_id: req.user.id, opportunity_id }
      });
    }

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    const application = await Application.create({
      user_id: req.user.id,
      application_type,
      job_id,
      tender_id,
      opportunity_id,
      cover_letter,
      application_data,
      documents: documents || []
    });

    // Increment application count on the related entity
    if (job_id) {
      await Job.increment('applications_count', { where: { id: job_id } });
    } else if (tender_id) {
      await Tender.increment('submissions_count', { where: { id: tender_id } });
    } else if (opportunity_id) {
      await Opportunity.increment('applications_count', { where: { id: opportunity_id } });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to review (admin or creator)
    const isAuthorized = req.user.subscription_type === 'enterprise' || 
                        (application.job_id && application.job.created_by === req.user.id) ||
                        (application.tender_id && application.tender.created_by === req.user.id) ||
                        (application.opportunity_id && application.opportunity.created_by === req.user.id);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this application'
      });
    }

    await application.update({
      status,
      review_notes,
      reviewed_at: new Date(),
      reviewed_by: req.user.id
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, application_type } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.id };

    if (status) whereClause.status = status;
    if (application_type) whereClause.application_type = application_type;

    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location', 'status', 'application_deadline']
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'organization', 'location', 'status', 'deadline']
        },
        {
          model: Opportunity,
          as: 'opportunity',
          attributes: ['id', 'title', 'organization', 'location', 'status', 'deadline']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user applications',
      error: error.message
    });
  }
};

const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.findAll({
      attributes: [
        'status',
        [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalApplications = await Application.count();
    const pendingApplications = await Application.count({ where: { status: 'pending' } });
    const acceptedApplications = await Application.count({ where: { status: 'accepted' } });

    res.json({
      success: true,
      data: {
        total_applications: totalApplications,
        pending_applications: pendingApplications,
        accepted_applications: acceptedApplications,
        applications_by_status: stats
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  getUserApplications,
  getApplicationStats
};
