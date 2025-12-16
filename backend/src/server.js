require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const ideaRoutes = require('./routes/ideaRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

// Khởi tạo Express app
const app = express();

// Kết nối database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Content Ideas Manager API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      ideas: '/api/ideas',
      ai: '/api/ai'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

