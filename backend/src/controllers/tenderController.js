const { Tender, User, Application } = require('../models');
const { Op } = require('sequelize');

const getAllTenders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      location,
      sector,
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
    if (sector) whereClause.sector = sector;
    if (category) whereClause.category = { [Op.like]: `%${category}%` };

    const { count, rows: tenders } = await Tender.findAndCountAll({
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

    console.log('Fetched tenders:', tenders.map(t => ({ id: t.id, title: t.title, organization_logo: t.organization_logo })));

    res.json({
      success: true,
      data: {
        tenders,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenders',
      error: error.message
    });
  }
};

const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;

    const tender = await Tender.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    // Increment view count
    await tender.increment('views_count');

    res.json({
      success: true,
      data: { tender }
    });
  } catch (error) {
    console.error('Get tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tender',
      error: error.message
    });
  }
};

const createTender = async (req, res) => {
  try {
    console.log('Creating tender with data:', req.body);
    console.log('Files received:', req.files);
    
    const tenderData = {
      ...req.body,
      created_by: req.user.id,
      approval_status: 'pending'
    };

    // Handle array fields that come as individual form fields (requirements[], project_scope[], etc.)
    if (req.body.requirements && Array.isArray(req.body.requirements)) {
      tenderData.requirements = req.body.requirements;
    }
    if (req.body.project_scope && Array.isArray(req.body.project_scope)) {
      tenderData.project_scope = req.body.project_scope;
    }
    if (req.body.technical_requirements && Array.isArray(req.body.technical_requirements)) {
      tenderData.technical_requirements = req.body.technical_requirements;
    }
    if (req.body.submission_process && Array.isArray(req.body.submission_process)) {
      tenderData.submission_process = req.body.submission_process;
    }
    if (req.body.evaluation_criteria && Array.isArray(req.body.evaluation_criteria)) {
      tenderData.evaluation_criteria = req.body.evaluation_criteria;
    }

    // Handle cover image
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      tenderData.cover_image = `/uploads/images/${req.files.coverImage[0].filename}`;
      console.log('Cover image set to:', tenderData.cover_image);
    }

    // Handle documents
    if (req.files && req.files.documents && req.files.documents.length > 0) {
      const documents = req.files.documents.map(file => ({
        name: file.originalname,
        url: `/uploads/images/${file.filename}`,
        size: file.size,
        type: file.mimetype
      }));
      tenderData.documents = documents;
      console.log('Documents set to:', documents);
    }

    const tender = await Tender.create(tenderData);
    console.log('Tender created successfully:', tender.id);

    res.status(201).json({
      success: true,
      message: 'Tender created successfully',
      data: { tender }
    });
  } catch (error) {
    console.error('Create tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tender',
      error: error.message
    });
  }
};

const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    // Check if user is the creator or admin
    if (tender.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tender'
      });
    }

    const updateData = { ...req.body };

    // Normalize array fields (support both arrays and repeated fields)
    if (req.body.requirements && Array.isArray(req.body.requirements)) updateData.requirements = req.body.requirements;
    if (req.body.project_scope && Array.isArray(req.body.project_scope)) updateData.project_scope = req.body.project_scope;
    if (req.body.technical_requirements && Array.isArray(req.body.technical_requirements)) updateData.technical_requirements = req.body.technical_requirements;
    if (req.body.submission_process && Array.isArray(req.body.submission_process)) updateData.submission_process = req.body.submission_process;
    if (req.body.evaluation_criteria && Array.isArray(req.body.evaluation_criteria)) updateData.evaluation_criteria = req.body.evaluation_criteria;
    if (req.body['tags[]']) {
      const tags = Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : [req.body['tags[]']]
      updateData.tags = tags
    } else if (Array.isArray(req.body.tags)) {
      updateData.tags = req.body.tags
    }

    // Handle file uploads (cover + documents) via multer .fields
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      updateData.cover_image = `/uploads/images/${req.files.coverImage[0].filename}`
    }
    if (req.files && req.files.documents && req.files.documents.length > 0) {
      const docs = req.files.documents.map(file => ({
        name: file.originalname,
        url: `/uploads/images/${file.filename}`,
        size: file.size,
        type: file.mimetype
      }))
      updateData.documents = docs
    }
    await tender.update(updateData);

    res.json({
      success: true,
      message: 'Tender updated successfully',
      data: { tender }
    });
  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tender',
      error: error.message
    });
  }
};

const deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    // Check if user is the creator or admin
    if (tender.created_by !== req.user.id && req.user.subscription_type !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this tender'
      });
    }

    await tender.destroy();

    res.json({
      success: true,
      message: 'Tender deleted successfully'
    });
  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tender',
      error: error.message
    });
  }
};

const getTenderStats = async (req, res) => {
  try {
    const stats = await Tender.findAll({
      attributes: [
        'status',
        [Tender.sequelize.fn('COUNT', Tender.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalTenders = await Tender.count();
    const activeTenders = await Tender.count({ where: { status: 'active' } });
    const totalViews = await Tender.sum('views_count');
    const totalSubmissions = await Tender.sum('submissions_count');

    res.json({
      success: true,
      data: {
        total_tenders: totalTenders,
        active_tenders: activeTenders,
        total_views: totalViews || 0,
        total_submissions: totalSubmissions || 0,
        tenders_by_status: stats
      }
    });
  } catch (error) {
    console.error('Get tender stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tender statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  getTenderStats
};
