require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  console.log('Attempting MongoDB connection...');
  
  // Try both connection methods
  const attempts = [
    { 
      type: 'SRV', 
      uri: process.env.MONGO_URI,
      options: {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000
      }
    },
    {
      type: 'Direct',
      uri: process.env.DIRECT_URI,
      options: {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 30000
      }
    }
  ];

  for (const attempt of attempts) {
    try {
      console.log(`Trying ${attempt.type} connection...`);
      await mongoose.connect(attempt.uri, attempt.options);
      console.log(`✅ Successfully connected via ${attempt.type} method`);
      console.log('Host:', mongoose.connection.host);
      return true;
    } catch (err) {
      console.log(`❌ ${attempt.type} connection failed: ${err.message}`);
    }
  }

  console.log('\n🔥 ALL CONNECTION ATTEMPTS FAILED');
  console.log('Required actions:');
  console.log('1. MANUAL CONNECTION TEST:');
  console.log(`   mongosh "${process.env.MONGO_URI}"`);
  console.log(`   mongosh "${process.env.DIRECT_URI}"`);
  console.log('2. VERIFY IN ATLAS:');
  console.log('   - Cluster name matches exactly (case-sensitive)');
  console.log('   - Network Access → IP Whitelist (0.0.0.0/0)');
  console.log('   - Database Access → User privileges');
  return false;
};

// Routes
app.get('/', (req, res) => res.send('VitalLog API'));

// Start server
const startServer = async () => {
  if (await connectDB()) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    });
  } else {
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log('⚡ Database connection ready');
});

startServer();