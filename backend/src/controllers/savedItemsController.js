const { SavedItem, Job, Tender, Opportunity, Course } = require('../models');

// GET /api/saved-items
const listSavedItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const items = await SavedItem.findAll({
      where: { user_id: userId },
      include: [
        { model: Job, as: 'job' },
        { model: Tender, as: 'tender' },
        { model: Opportunity, as: 'opportunity' },
        { model: Course, as: 'course' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({ success: true, data: { items } });
  } catch (error) {
    console.error('List saved items error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch saved items', error: error.message });
  }
};

// POST /api/saved-items
const saveItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { item_type, job_id, tender_id, opportunity_id, course_id, notes, tags } = req.body;

    const payload = {
      user_id: userId,
      item_type,
      job_id: job_id || null,
      tender_id: tender_id || null,
      opportunity_id: opportunity_id || null,
      course_id: course_id || null,
      notes: notes || null,
      tags: Array.isArray(tags) ? tags : []
    };

    const saved = await SavedItem.create(payload);
    return res.status(201).json({ success: true, data: { saved_item: saved } });
  } catch (error) {
    console.error('Save item error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save item', error: error.message });
  }
};

// DELETE /api/saved-items/:id
const removeItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const item = await SavedItem.findByPk(id);
    if (!item || item.user_id !== userId) {
      return res.status(404).json({ success: false, message: 'Saved item not found' });
    }

    await item.destroy();
    return res.json({ success: true, message: 'Removed bookmark' });
  } catch (error) {
    console.error('Remove saved item error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove item', error: error.message });
  }
};

module.exports = { listSavedItems, saveItem, removeItem };


