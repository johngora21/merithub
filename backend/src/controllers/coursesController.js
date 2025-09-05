const { Course, CourseEnrollment, User } = require('../models');

const list = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const where = {
      approval_status: 'approved'
    };
    if (status) where.status = status;
    if (search) where.title = { $like: `%${search}%` };

    const offset = (page - 1) * limit;
    const { rows, count } = await Course.findAndCountAll({ where, limit: parseInt(limit, 10), offset, order: [['createdAt', 'DESC']] });
    res.json({ courses: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page, 10) });
  } catch (e) {
    console.error('Courses list error:', e);
    res.status(500).json({ message: 'Failed to list courses' });
  }
};

const create = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      created_by: req.user?.id,
      approval_status: 'pending'
    };
    const course = await Course.create(courseData);
    res.json({ course });
  } catch (e) {
    console.error('Course create error:', e);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

const getById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (e) {
    console.error('Course get error:', e);
    res.status(500).json({ message: 'Failed to get course' });
  }
};

const update = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.update(req.body);
    res.json({ course });
  } catch (e) {
    console.error('Course update error:', e);
    res.status(500).json({ message: 'Failed to update course' });
  }
};

const remove = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error('Course delete error:', e);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.id };

    if (status) whereClause.status = status;

    const { count, rows: enrollments } = await CourseEnrollment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'instructor', 'category', 'level', 'duration_hours', 'price', 'currency', 'thumbnail_url', 'rating', 'review_count', 'is_free', 'status']
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        courses: enrollments,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user courses',
      error: error.message
    });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { course_id } = req.body;

    // Check if course exists
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      where: { user_id: req.user.id, course_id }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await CourseEnrollment.create({
      user_id: req.user.id,
      course_id,
      status: 'enrolled'
    });

    // Increment enrollment count
    await Course.increment('enrollment_count', { where: { id: course_id } });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { enrollment }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const { enrollment_id } = req.params;
    const { progress, completed_lessons, time_spent, status } = req.body;

    const enrollment = await CourseEnrollment.findOne({
      where: { id: enrollment_id, user_id: req.user.id }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (completed_lessons !== undefined) updateData.completed_lessons = completed_lessons;
    if (time_spent !== undefined) updateData.time_spent = time_spent;
    if (status !== undefined) updateData.status = status;
    
    updateData.last_accessed = new Date();

    // If completed, set completion date
    if (status === 'completed') {
      updateData.completed_at = new Date();
    }

    await enrollment.update(updateData);

    res.json({
      success: true,
      message: 'Course progress updated successfully',
      data: { enrollment }
    });
  } catch (error) {
    console.error('Update course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course progress',
      error: error.message
    });
  }
};

module.exports = { list, create, getById, update, remove, getMyCourses, enrollInCourse, updateCourseProgress };



