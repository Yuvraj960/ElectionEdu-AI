const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your')) {
      console.warn('⚠️ Warning: MongoDB URI not set. Skipping DB connection.');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Import Routes (will be created in Phase 2)
const healthRoutes = require('./routes/health');
const overviewRoutes = require('./routes/overview');
const chatRoutes = require('./routes/chat');
const timelineRoutes = require('./routes/timeline');
const quizRoutes = require('./routes/quiz');
const glossaryRoutes = require('./routes/glossary');

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api', overviewRoutes);
app.use('/api', chatRoutes);
app.use('/api', timelineRoutes);
app.use('/api', quizRoutes);
app.use('/api', glossaryRoutes);

// Global Error Handler (fallback for unhandled routes and errors)
app.use((err, req, res, next) => {
  console.error('⚠️ Global Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
