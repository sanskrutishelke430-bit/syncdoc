// server.js — main entry point for the backend
require('dotenv').config(); // loads variables from .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json()); // lets us read JSON from request bodies

// Simple test route to check the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SyncDoc backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Error handler must be added last, after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});