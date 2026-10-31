require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Institutional Event & Notice Board System API',
    time: new Date().toISOString()
  });
});

// Root API info
app.get('/', (req, res) => {
  res.send('Institutional Notice Board API is running.');
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Institutional Notice Board Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('Fatal: Failed to connect database', err);
    process.exit(1);
  });
