const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database');

const authRoutes = require('./routes/auth');
const activitiesRoutes = require('./routes/activities');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log('🚀 SERVER STARTED');
    console.log(`🌐 Port: ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();