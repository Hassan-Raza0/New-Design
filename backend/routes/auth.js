const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
}).fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 },
]);

// ✅ Register route
router.post('/register', upload, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipCode,
      deviceType,
      deviceModel,
      customDeviceName,
      planType,
      selectedAddOns,
      purchaseDate,
    } = req.body;

    const frontImage = req.files['frontImage']?.[0]?.filename;
    const backImage = req.files['backImage']?.[0]?.filename;

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;
    const model = deviceModel === 'other' ? customDeviceName : deviceModel;

    const result = await pool.query(
      `INSERT INTO users 
        (name, email, password, role, phone, address, city, state, zip_code, front_image, back_image, purchase_date, model, plan)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        fullName,
        email,
        hashedPassword,
        'customer',
        phone,
        address,
        city,
        state,
        zipCode,
        frontImage,
        backImage,
        purchaseDate,
        model,
        planType,
      ]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ EXPORT THE ROUTER (Missing in your version!)
module.exports = router;
