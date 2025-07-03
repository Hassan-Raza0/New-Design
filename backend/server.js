const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth'); // ✅ MUST export a valid router

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For form-data

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes); // ✅ Correct route setup

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
