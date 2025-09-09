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
    console.log('Contract value fields:', {
      contract_value_min: req.body.contract_value_min,
      contract_value_max: req.body.contract_value_max,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      salaryType: req.body.salaryType
    });
    console.log('Array fields received:', {
      requirements: req.body.requirements,
      'requirements[]': req.body['requirements[]'],
      project_scope: req.body.project_scope,
      'project_scope[]': req.body['project_scope[]'],
      technical_requirements: req.body.technical_requirements,
      'technical_requirements[]': req.body['technical_requirements[]'],
      submission_process: req.body.submission_process,
      'submission_process[]': req.body['submission_process[]'],
      evaluation_criteria: req.body.evaluation_criteria,
      'evaluation_criteria[]': req.body['evaluation_criteria[]']
    });
    console.log('Contact fields received:', {
      contact_email: req.body.contact_email,
      contact_phone: req.body.contact_phone
    });
    
    const tenderData = {
      title: req.body.title,
      description: req.body.description,
      organization: req.body.organization,
      location: req.body.location,
      country: req.body.country,
      deadline: req.body.deadline,
      sector: req.body.sector,
      category: req.body.category || 'general',
      currency: req.body.currency || 'USD',
      duration: req.body.duration || req.body.experience,
      price: req.body.price || 'Free',
      external_url: req.body.external_url,
      contact_email: req.body.contact_email,
      contact_phone: req.body.contact_phone,
      submission_type: req.body.submission_type || 'electronic',
      is_urgent: req.body.is_urgent || false,
      created_by: req.user.id,
      approval_status: 'pending'
    };

    // Handle contract value fields specifically
    if (req.body.contract_value_min !== undefined) {
      tenderData.contract_value_min = req.body.contract_value_min ? parseFloat(req.body.contract_value_min) : null;
    } else {
      tenderData.contract_value_min = null;
    }
    if (req.body.contract_value_max !== undefined) {
      tenderData.contract_value_max = req.body.contract_value_max ? parseFloat(req.body.contract_value_max) : null;
    } else {
      tenderData.contract_value_max = null;
    }

    // Handle array fields that come as individual form fields (requirements[], project_scope[], etc.)
    // Check both with and without [] suffix
    if (req.body.requirements && Array.isArray(req.body.requirements)) {
      tenderData.requirements = req.body.requirements;
    } else if (req.body['requirements[]'] && Array.isArray(req.body['requirements[]'])) {
      tenderData.requirements = req.body['requirements[]'];
    } else {
      tenderData.requirements = [];
    }
    
    if (req.body.submission_process && Array.isArray(req.body.submission_process)) {
      tenderData.submission_process = req.body.submission_process;
    } else if (req.body['submission_process[]'] && Array.isArray(req.body['submission_process[]'])) {
      tenderData.submission_process = req.body['submission_process[]'];
    } else {
      tenderData.submission_process = [];
    }
    
    if (req.body.evaluation_criteria && Array.isArray(req.body.evaluation_criteria)) {
      tenderData.evaluation_criteria = req.body.evaluation_criteria;
    } else if (req.body['evaluation_criteria[]'] && Array.isArray(req.body['evaluation_criteria[]'])) {
      tenderData.evaluation_criteria = req.body['evaluation_criteria[]'];
    } else {
      tenderData.evaluation_criteria = [];
    }

    // Handle tags field
    if (req.body.tags && Array.isArray(req.body.tags)) {
      tenderData.tags = req.body.tags;
    } else if (req.body['tags[]'] && Array.isArray(req.body['tags[]'])) {
      tenderData.tags = req.body['tags[]'];
    } else {
      tenderData.tags = [];
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

    console.log('Final tenderData being saved:', {
      title: tenderData.title,
      organization: tenderData.organization,
      requirements: tenderData.requirements,
      project_scope: tenderData.project_scope,
      technical_requirements: tenderData.technical_requirements,
      submission_process: tenderData.submission_process,
      evaluation_criteria: tenderData.evaluation_criteria,
      contact_email: tenderData.contact_email,
      contact_phone: tenderData.contact_phone
    });
    
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
    console.log('Updating tender:', id, 'with data:', req.body);
    console.log('Contract value fields:', {
      contract_value_min: req.body.contract_value_min,
      contract_value_max: req.body.contract_value_max,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      salaryType: req.body.salaryType
    });
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

    // Handle contract value fields specifically
    if (req.body.contract_value_min !== undefined) {
      updateData.contract_value_min = req.body.contract_value_min ? parseFloat(req.body.contract_value_min) : null;
    } else {
      updateData.contract_value_min = null;
    }
    if (req.body.contract_value_max !== undefined) {
      updateData.contract_value_max = req.body.contract_value_max ? parseFloat(req.body.contract_value_max) : null;
    } else {
      updateData.contract_value_max = null;
    }

    // Normalize array fields (support both arrays and repeated fields)
    // Check both with and without [] suffix
    if (req.body.requirements && Array.isArray(req.body.requirements)) {
      updateData.requirements = req.body.requirements;
    } else if (req.body['requirements[]'] && Array.isArray(req.body['requirements[]'])) {
      updateData.requirements = req.body['requirements[]'];
    }
    
    if (req.body.submission_process && Array.isArray(req.body.submission_process)) {
      updateData.submission_process = req.body.submission_process;
    } else if (req.body['submission_process[]'] && Array.isArray(req.body['submission_process[]'])) {
      updateData.submission_process = req.body['submission_process[]'];
    }
    
    if (req.body.evaluation_criteria && Array.isArray(req.body.evaluation_criteria)) {
      updateData.evaluation_criteria = req.body.evaluation_criteria;
    } else if (req.body['evaluation_criteria[]'] && Array.isArray(req.body['evaluation_criteria[]'])) {
      updateData.evaluation_criteria = req.body['evaluation_criteria[]'];
    }
    // Handle tags field
    if (req.body.tags && Array.isArray(req.body.tags)) {
      updateData.tags = req.body.tags;
    } else if (req.body['tags[]'] && Array.isArray(req.body['tags[]'])) {
      updateData.tags = req.body['tags[]'];
    } else {
      updateData.tags = [];
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
