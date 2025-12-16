const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema cho User (Người dùng)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
      maxlength: [50, 'Tên không được vượt quá 50 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email không hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password là bắt buộc'],
      minlength: [6, 'Password phải có ít nhất 6 ký tự'],
      select: false // Không trả về password khi query
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

/**
 * Middleware: Hash password trước khi save
 */
userSchema.pre('save', async function(next) {
  // Chỉ hash khi password được modify
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password với salt rounds = 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: So sánh password
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method: Tạo JWT token
 */
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);



