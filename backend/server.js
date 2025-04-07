require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const metricRoutes = require('./routes/metricRoutes');
const errorHandler = require('./middleware/error');

const app = express();

// Enhanced Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Database Connection with Reconnect Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10
    });
    
    console.log('✅ MongoDB Connected');
    
    mongoose.connection.on('connected', () => 
      console.log('Mongoose connected to DB cluster'));
      
    mongoose.connection.on('error', (err) => 
      console.error('Mongoose connection error:', err));
      
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected. Reconnecting...');
      setTimeout(connectDB, 5000);
    });
    
  } catch (err) {
    console.error('❌ Initial DB connection failed:', err.message);
    process.exit(1);
  }
};

// Health Check Endpoints
app.get('/', (req, res) => res.json({
  service: 'VitalLog API',
  status: 'operational',
  version: process.env.npm_package_version,
  timestamp: new Date().toISOString()
}));

app.get('/health-data', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    services: ['api', 'database'],
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricRoutes);

// Centralized Error Handling
app.use(errorHandler);

// Server Startup with Graceful Shutdown
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Important for Codespaces

const server = app.listen(PORT, HOST, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    
    // For Codespaces specifically
    if (process.env.CODESPACES === 'true') {
      console.log(`🌐 Codespaces URL: https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
    }
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
});
// Graceful shutdown handlers
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

const shutdown = (signal) => {
  console.log(`\n${signal} received: shutting down gracefully...`);
  server.close(async () => {
    await mongoose.connection.close();
    console.log('HTTP server and DB connections closed');
    process.exit(0);
  });
};