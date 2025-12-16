const Idea = require('../models/Idea');

/**
 * @desc    Lấy tất cả ý tưởng
 * @route   GET /api/ideas
 * @access  Private
 */
const getAllIdeas = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      priority,
      search 
    } = req.query;

    // Xây dựng query filter
    const filter = {};
    
    // Chỉ lấy ideas của user hiện tại
    if (req.user) {
      filter.user = req.user.id;
    }
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const ideas = await Idea.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Idea.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: ideas.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: ideas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy một ý tưởng theo ID
 * @route   GET /api/ideas/:id
 * @access  Private
 */
const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('user', 'name email');

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ý tưởng'
      });
    }

    // Kiểm tra ownership
    if (idea.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem ý tưởng này'
      });
    }

    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo ý tưởng mới
 * @route   POST /api/ideas
 * @access  Private
 */
const createIdea = async (req, res, next) => {
  try {
    const { title, description, category, status, priority, tags } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề là bắt buộc'
      });
    }

    // Gắn user ID vào idea
    const idea = await Idea.create({
      title,
      description,
      category,
      status,
      priority,
      tags,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Tạo ý tưởng thành công',
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật ý tưởng
 * @route   PUT /api/ideas/:id
 * @access  Private
 */
const updateIdea = async (req, res, next) => {
  try {
    const { title, description, category, status, priority, tags } = req.body;

    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ý tưởng'
      });
    }

    // Kiểm tra ownership
    if (idea.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật ý tưởng này'
      });
    }

    idea = await Idea.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status, priority, tags },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Cập nhật ý tưởng thành công',
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa ý tưởng
 * @route   DELETE /api/ideas/:id
 * @access  Private
 */
const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ý tưởng'
      });
    }

    // Kiểm tra ownership
    if (idea.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa ý tưởng này'
      });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa ý tưởng thành công',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thống kê
 * @route   GET /api/ideas/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    // Chỉ thống kê ideas của user hiện tại
    const filter = req.user ? { user: req.user.id } : {};
    
    const totalIdeas = await Idea.countDocuments(filter);
    
    const statsByStatus = await Idea.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const statsByCategory = await Idea.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsByPriority = await Idea.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalIdeas,
        byStatus: statsByStatus,
        byCategory: statsByCategory,
        byPriority: statsByPriority
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  getStats
};

