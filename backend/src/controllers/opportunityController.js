const { Opportunity, User, Application } = require('../models');
const { Op } = require('sequelize');

const getAllOpportunities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      location,
      type,
      category,
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
        { organization: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (location) whereClause.location = { [Op.like]: `%${location}%` };
    if (type) whereClause.type = type;
    if (category) whereClause.category = { [Op.like]: `%${category}%` };

    const { count, rows: opportunities } = await Opportunity.findAndCountAll({
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
        opportunities,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunities',
      error: error.message
    });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Increment view count
    await opportunity.increment('views_count');

    res.json({
      success: true,
      data: { opportunity }
    });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity',
      error: error.message
    });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const opportunityData = { 
      ...req.body, 
      created_by: req.user.id,
      approval_status: 'pending'
    };

    // Handle uploaded files
    if (req.files) {
      if (req.files.organizationLogo && req.files.organizationLogo[0]) {
        opportunityData.organization_logo = `/uploads/images/${req.files.organizationLogo[0].filename}`;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverUrl = `/uploads/images/${req.files.coverImage[0].filename}`;
        // ensure documents is an array
        let documents = [];
        try { documents = Array.isArray(req.body.documents) ? req.body.documents : (req.body.documents ? JSON.parse(req.body.documents) : []); } catch { documents = []; }
        // add cover marker
        documents.push({ type: 'cover', url: coverUrl });
        opportunityData.documents = documents;
      }
    }

    const opportunity = await Opportunity.create(opportunityData);

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: { opportunity }
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create opportunity',
      error: error.message
    });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findByPk(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user is the creator or admin
    if (opportunity.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this opportunity'
      });
    }

    const updateData = { ...req.body };
    if (req.files) {
      if (req.files.organizationLogo && req.files.organizationLogo[0]) {
        updateData.organization_logo = `/uploads/images/${req.files.organizationLogo[0].filename}`;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverUrl = `/uploads/images/${req.files.coverImage[0].filename}`;
        let documents = [];
        try { documents = Array.isArray(updateData.documents) ? updateData.documents : (updateData.documents ? JSON.parse(updateData.documents) : opportunity.documents || []); } catch { documents = opportunity.documents || []; }
        documents = (documents || []).filter(d => d && d.type !== 'cover');
        documents.push({ type: 'cover', url: coverUrl });
        updateData.documents = documents;
      }
    }

    await opportunity.update(updateData);

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: { opportunity }
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update opportunity',
      error: error.message
    });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findByPk(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user is the creator or admin
    if (opportunity.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this opportunity'
      });
    }

    await opportunity.destroy();

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity',
      error: error.message
    });
  }
};

const getOpportunityStats = async (req, res) => {
  try {
    const stats = await Opportunity.findAll({
      attributes: [
        'status',
        [Opportunity.sequelize.fn('COUNT', Opportunity.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalOpportunities = await Opportunity.count();
    const activeOpportunities = await Opportunity.count({ where: { status: 'active' } });
    const totalViews = await Opportunity.sum('views_count');
    const totalApplications = await Opportunity.sum('applications_count');

    res.json({
      success: true,
      data: {
        total_opportunities: totalOpportunities,
        active_opportunities: activeOpportunities,
        total_views: totalViews || 0,
        total_applications: totalApplications || 0,
        opportunities_by_status: stats
      }
    });
  } catch (error) {
    console.error('Get opportunity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityStats
};
