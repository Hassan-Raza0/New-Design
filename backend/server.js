const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth'); // ✅ Auth routes
const paymentRoutes = require('./routes/payment'); // ✅ Payment route

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For form-data

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);      // ✅ Auth API
app.use('/api/payment', paymentRoutes); // ✅ Stripe Payment API

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
