const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Xác thực JWT token
 * Bảo vệ các routes yêu cầu authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Lấy token từ header: "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Kiểm tra token có tồn tại không
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập, vui lòng đăng nhập'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy user từ database và gán vào req.user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

/**
 * Middleware: Kiểm tra role của user
 * @param  {...string} roles - Các roles được phép truy cập
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' không có quyền truy cập`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };



