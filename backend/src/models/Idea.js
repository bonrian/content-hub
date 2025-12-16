const mongoose = require('mongoose');

/**
 * Schema cho Idea (Ý tưởng nội dung)
 */
const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự']
    },
    category: {
      type: String,
      enum: {
        values: ['blog', 'video', 'social-media', 'podcast', 'newsletter', 'other'],
        message: '{VALUE} không phải là category hợp lệ'
      },
      default: 'other'
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'in-progress', 'completed', 'archived'],
        message: '{VALUE} không phải là status hợp lệ'
      },
      default: 'draft'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} không phải là priority hợp lệ'
      },
      default: 'medium'
    },
    tags: {
      type: [String],
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID là bắt buộc']
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
);

// Index để tìm kiếm nhanh hơn
ideaSchema.index({ title: 'text', description: 'text' });
ideaSchema.index({ status: 1, priority: 1 });
ideaSchema.index({ user: 1, createdAt: -1 });

/**
 * Static method: Lấy thống kê theo status
 */
ideaSchema.statics.getStatsByStatus = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Idea', ideaSchema);

