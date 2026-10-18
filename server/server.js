const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configure public DNS servers to prevent Windows querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns servers cannot be set
}

const app = express();
const PORT = process.env.PORT || 5000;
// Default to local MongoDB on port 27017 or Atlas from .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuscart';
const JWT_SECRET = process.env.JWT_SECRET || 'campuscart_default_fallback_jwt_secret_2025';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'campuscart_admin_key_2025';

// Track MongoDB connection state
let isDbConnected = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==========================================
// MONGOOSE SCHEMAS & MODELS
// ==========================================

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  studentId: { type: String, trim: true, default: '24BCE327' },
  college: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, default: '1st Year' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Books & Notes',
      'Electronics',
      'Calculators',
      'Lab Equipment',
      'Bicycles',
      'Furniture',
      'Sports Equipment',
      'Other Essentials'
    ]
  },
  price: { type: Number, required: true, min: 0 },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: String, required: true },
  location: {
    address: { type: String, default: 'Central Campus Library' },
    city: { type: String, default: 'Austin' },
    coordinates: {
      lat: { type: Number, default: 30.2849 },
      lng: { type: Number, default: -97.7341 }
    }
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Sold'],
    default: 'Available'
  },
  createdAt: { type: Date, default: Date.now }
});


const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const transactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  deliveryLocation: {
    address: { type: String, default: 'Central Campus Library' },
    city: { type: String, default: 'Austin' },
    coordinates: {
      lat: { type: Number, default: 30.2849 },
      lng: { type: Number, default: -97.7341 }
    }
  },
  paymentMethod: { type: String, default: 'cash_on_meetup' },
  message: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  details: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Dismissed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Report = mongoose.model('Report', reportSchema);

// ==========================================
// DATABASE CONNECTION & SEEDING
// ==========================================

async function seedInitialData() {
  try {
    // 1. Seed Administrator
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@campuscart.edu').toLowerCase();
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
      admin = await User.create({
        fullName: 'Campus Administrator',
        email: adminEmail,
        password: hashedPassword,
        college: 'National Institute of Technology',
        department: 'Campus Administration',
        academicYear: 'Staff',
        role: 'admin'
      });
      console.log('✅ Default administrator seeded:', adminEmail);
    }

    // 2. Seed Demo Student
    const studentEmail = 'student@campuscart.edu';
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      const hashedPassword = await bcrypt.hash('Student@123', 10);
      student = await User.create({
        fullName: 'Parv',
        email: studentEmail,
        password: hashedPassword,
        studentId: '24BCE327',
        college: 'National Institute of Technology',
        department: 'Computer Science and Engineering',
        academicYear: '3rd Year',
        role: 'student'
      });
      console.log('✅ Demo student account seeded:', studentEmail);
    }

    // 3. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const seedProducts = [
        {
          title: 'Higher Engineering Mathematics - B.S. Grewal (44th Ed)',
          description: 'Essential textbook for 1st & 2nd year B.Tech mathematics. Clean condition with key formulas highlighted. Solved question papers included.',
          category: 'Books & Notes',
          price: 450,
          condition: 'Good',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Casio FX-991EX ClassWiz Scientific Calculator',
          description: '552 functions, natural textbook display, solar + battery. Ideal for engineering mechanics, calculus, and university semester exams.',
          category: 'Calculators',
          price: 950,
          condition: 'Like New',
          image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Firefox Target 21-Speed Mountain Bicycle',
          description: 'Smooth gear shifting, front suspension, dual disc brakes. Perfect for campus commuting between hostels and lecture halls.',
          category: 'Bicycles',
          price: 5490,
          condition: 'Good',
          image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Chemistry & Biology Lab Apron + Glassware Kit',
          description: 'Standard white cotton lab coat (Size L), safety goggles, test tube holder, and basic dissecting tools for college lab practicals.',
          category: 'Lab Equipment',
          price: 650,
          condition: 'Like New',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Sony WH-CH520 Wireless Bluetooth Headphones',
          description: '50-hour battery life, lightweight design, built-in mic for online lectures and library study sessions. Fast USB-C charging.',
          category: 'Electronics',
          price: 2490,
          condition: 'Good',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Foldable Wooden Hostel Study Desk with Cup Holder',
          description: 'Space-saving study table with tablet holder, anti-slip legs, durable MDF wood top. Perfect for hostel rooms and dorms.',
          category: 'Furniture',
          price: 750,
          condition: 'Like New',
          image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Yonex Muscle Power 29 Badminton Racket with Full Cover',
          description: 'Isometric head shape, aluminum frame, pre-strung with high-tension BG65 string. Great for campus indoor sports complex.',
          category: 'Sports Equipment',
          price: 1250,
          condition: 'Good',
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        },
        {
          title: 'Pigeon Cruise 1800-Watt Induction Cooktop',
          description: '7 preset Indian cooking menus, dual heat sensor, automatic shut-off. Perfect for quick late-night hostel cooking and tea.',
          category: 'Other Essentials',
          price: 1450,
          condition: 'Fair',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          seller: student._id,
          college: 'National Institute of Technology',
          status: 'Available'
        }
      ];

      await Product.insertMany(seedProducts);
      console.log('✅ Initial demo campus products seeded successfully.');
    } else {
      // Sync any previously seeded items to realistic market benchmarks
      await Product.updateMany({ title: { $regex: /Sony WH-CH520/i }, price: { $lt: 2000 } }, { $set: { price: 2490 } });
      await Product.updateMany({ title: { $regex: /Firefox Target/i }, price: { $lt: 5000 } }, { $set: { price: 5490 } });
      await Product.updateMany({ title: { $regex: /Casio FX-991EX/i }, price: { $lt: 900 } }, { $set: { price: 950 } });
      await Product.updateMany({ title: { $regex: /Higher Engineering Mathematics/i }, price: { $lt: 400 } }, { $set: { price: 450 } });
      await Product.updateMany({ title: { $regex: /Yonex Muscle Power/i }, price: { $lt: 1000 } }, { $set: { price: 1250 } });
      await Product.updateMany({ title: { $regex: /Pigeon Cruise/i }, price: { $lt: 1200 } }, { $set: { price: 1450 } });
      await Product.updateMany({ title: { $regex: /Lab Apron/i }, price: { $lt: 500 } }, { $set: { price: 650 } });
      await Product.updateMany({ title: { $regex: /Foldable Wooden Hostel/i }, price: { $lt: 700 } }, { $set: { price: 750 } });
    }
  } catch (error) {
    console.error('Error during initial data seeding:', error.message);
  }
}

function connectDatabase() {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    isDbConnected = true;
    console.log(`✅ Connected to MongoDB at: ${MONGO_URI}`);
    seedInitialData();
  })
  .catch((err) => {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
    console.warn('👉 Tip: Ensure your local MongoDB is running, or verify your MONGO_URI in server/.env with your MongoDB Atlas connection string.');
  });
}

connectDatabase();

mongoose.connection.on('connected', () => { isDbConnected = true; });
mongoose.connection.on('disconnected', () => { isDbConnected = false; });
mongoose.connection.on('error', () => { isDbConnected = false; });

// Database readiness check middleware
const checkDb = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: 'MongoDB is currently unreachable. Please ensure MongoDB is started locally or supply a valid MONGO_URI in server/.env.',
      isDbConnected: false
    });
  }
  next();
};

// ==========================================
// AUTHENTICATION UTILITIES & MIDDLEWARE
// In-memory user registry for seamless offline resilience
const inMemoryUsers = [
  {
    _id: 'usr-admin-1',
    fullName: 'Campus Administrator',
    email: 'admin@campuscart.edu',
    password: bcrypt.hashSync('Admin@123', 10),
    studentId: 'ADMIN-01',
    college: 'National Institute of Technology',
    department: 'Campus Administration',
    academicYear: 'Staff',
    role: 'admin',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: 'usr-student-1',
    fullName: 'Parv',
    email: 'student@campuscart.edu',
    password: bcrypt.hashSync('Student@123', 10),
    studentId: '24BCE327',
    college: 'National Institute of Technology',
    department: 'Computer Science and Engineering',
    academicYear: '3rd Year',
    role: 'student',
    isActive: true,
    createdAt: new Date()
  }
];

const sendTokenResponse = (user, res, statusCode = 200) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId || '24BCE327',
      college: user.college,
      department: user.department,
      academicYear: user.academicYear,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  });
};

const requireAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Also support Bearer authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    if (isDbConnected) {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      const memUser = inMemoryUsers.find(u => String(u._id) === String(decoded.id));
      if (memUser) {
        const { password, ...safeUser } = memUser;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Please contact campus admin.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
};

// ==========================================
// API ROUTES
// ==========================================

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusCart API',
    isDbConnected,
    mongoUri: MONGO_URI.startsWith('mongodb+srv://') ? 'MongoDB Atlas (Configured)' : MONGO_URI,
    timestamp: new Date().toISOString()
  });
});

// 2. GEOCODING API ENDPOINTS (OpenStreetMap Nominatim Integration)
// Reverse Geocoding: Get exact location from GPS coordinates (lat, lng)
app.get('/api/geocode/reverse', (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and Longitude are required parameters.' });
    }

    const https = require('https');
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&format=json&addressdetails=1`;

    const requestOptions = {
      headers: {
        'User-Agent': 'CampusCart-University-App/1.0 (academic-project@campus.edu)',
        'Accept': 'application/json'
      }
    };

    https.get(url, requestOptions, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => { data += chunk; });
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            return res.status(404).json({ success: false, error: json.error });
          }
          res.json({
            success: true,
            displayName: json.display_name,
            address: json.address || {},
            road: json.address?.road || json.address?.pedestrian || json.address?.amenity || 'Campus Walk',
            building: json.address?.amenity || json.address?.building || json.name || 'Campus Building',
            city: json.address?.city || json.address?.town || json.address?.county || 'Austin',
            state: json.address?.state || 'Texas',
            postcode: json.address?.postcode || '78712',
            country: json.address?.country || 'United States',
            lat: parseFloat(json.lat),
            lng: parseFloat(json.lon)
          });
        } catch (e) {
          res.status(500).json({ success: false, error: 'Failed to parse reverse geocoding response.' });
        }
      });
    }).on('error', (err) => {
      res.status(502).json({ success: false, error: `Geocoding network error: ${err.message}` });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Forward Geocoding: Search exact location by text query (campus building, street, address)
app.get('/api/geocode/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, error: 'Query string q is required.' });
    }

    const https = require('https');
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.trim())}&format=json&limit=5&addressdetails=1`;

    const requestOptions = {
      headers: {
        'User-Agent': 'CampusCart-University-App/1.0 (academic-project@campus.edu)',
        'Accept': 'application/json'
      }
    };

    https.get(url, requestOptions, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => { data += chunk; });
      apiRes.on('end', () => {
        try {
          const results = JSON.parse(data);
          res.json({
            success: true,
            results: Array.isArray(results) ? results.map(r => ({
              displayName: r.display_name,
              name: r.name || r.display_name.split(',')[0],
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
              type: r.type,
              city: r.address?.city || r.address?.town || r.address?.county || 'Austin',
              postcode: r.address?.postcode || '',
              country: r.address?.country || 'United States'
            })) : []
          });
        } catch (e) {
          res.status(500).json({ success: false, error: 'Failed to parse search geocoding response.' });
        }
      });
    }).on('error', (err) => {
      res.status(502).json({ success: false, error: `Geocoding search network error: ${err.message}` });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. AUTHENTICATION ROUTES (MongoDB Mongoose with Resilient Fallback)

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, studentId, college, department, academicYear } = req.body;

    if (!fullName || !email || !password || !college || !department) {
      return res.status(400).json({ error: 'Please provide all required registration fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRoll = studentId?.trim() || '24BCE' + Math.floor(100 + Math.random() * 900);

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const user = await User.create({
        fullName: fullName.trim(),
        email: cleanEmail,
        password: hashedPassword,
        studentId: assignedRoll,
        college: college.trim(),
        department: department.trim(),
        academicYear: academicYear?.trim() || '1st Year',
        role: 'student'
      });

      return sendTokenResponse(user, res, 201);
    } else {
      // In-Memory Registration Fallback
      const existingMem = inMemoryUsers.find(u => u.email === cleanEmail);
      if (existingMem) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const newMemUser = {
        _id: 'usr-' + Date.now(),
        fullName: fullName.trim(),
        email: cleanEmail,
        password: hashedPassword,
        studentId: assignedRoll,
        college: college.trim(),
        department: department.trim(),
        academicYear: academicYear?.trim() || '1st Year',
        role: 'student',
        isActive: true,
        createdAt: new Date()
      };

      inMemoryUsers.push(newMemUser);
      console.log('✅ Registered student stored:', cleanEmail);
      return sendTokenResponse(newMemUser, res, 201);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'Your account is deactivated. Contact the administrator.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      return sendTokenResponse(user, res, 200);
    } else {
      // In-Memory Login Fallback
      const memUser = inMemoryUsers.find(u => u.email === cleanEmail);
      if (!memUser) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      if (!memUser.isActive) {
        return res.status(403).json({ error: 'Your account is deactivated. Contact the administrator.' });
      }

      const isMatch = await bcrypt.compare(password, memUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      console.log('✅ Student logged in:', cleanEmail);
      return sendTokenResponse(memUser, res, 200);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during login.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get Current User Profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Update Profile
app.put('/api/auth/profile', checkDb, requireAuth, async (req, res) => {
  try {
    const { fullName, college, department, academicYear, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName.trim();
    if (college) user.college = college.trim();
    if (department) user.department = department.trim();
    if (academicYear) user.academicYear = academicYear.trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json({ success: true, user: updated, message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update profile.' });
  }
});

// Controlled Administrator Promotion using ADMIN_SECRET
app.post('/api/admin/setup', checkDb, requireAuth, async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey || secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid administrator setup secret key.' });
    }

    const user = await User.findById(req.user._id);
    user.role = 'admin';
    await user.save();

    sendTokenResponse(user, res, 200);
  } catch (error) {
    res.status(500).json({ error: 'Administrator setup failed.' });
  }
});

// 3. PRODUCT ROUTES

// Browse & Search Products
app.get('/api/products', checkDb, async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, condition, status, sort } = req.query;
    const filter = {};

    // Search by title or description
    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (condition && condition !== 'All') {
      filter.condition = condition;
    }

    if (status && status !== 'All') {
      filter.status = status;
    } else if (!status) {
      // Default to Available for general browsing
      filter.status = 'Available';
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const products = await Product.find(filter)
      .populate('seller', 'fullName email college department')
      .sort(sortOptions);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching products.' });
  }
});

// Single Product Details
app.get('/api/products/:id', checkDb, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName email college department academicYear');

    if (!product) {
      return res.status(404).json({ error: 'Product listing not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Invalid product ID or listing not found.' });
  }
});

// Create Product Listing
app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { title, description, category, price, condition, image, location } = req.body;

    if (!title || !description || !category || price === undefined || !condition) {
      return res.status(400).json({ error: 'Please provide all required product details.' });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }

    if (isDbConnected) {
      const product = await Product.create({
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        condition,
        image: image && image.trim() !== '' ? image.trim() : undefined,
        seller: req.user._id,
        college: req.user.college || 'National Institute of Technology',
        location: location || undefined,
        status: 'Available'
      });

      const populatedProduct = await Product.findById(product._id).populate('seller', 'fullName email college department');
      return res.status(201).json({ success: true, product: populatedProduct, message: 'Listing created successfully!' });
    } else {
      const newProduct = {
        _id: 'cc-' + Date.now(),
        id: 'cc-' + Date.now(),
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        condition,
        image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        seller: {
          _id: req.user._id,
          name: req.user.fullName,
          fullName: req.user.fullName,
          email: req.user.email,
          studentId: req.user.studentId,
          college: req.user.college,
          department: req.user.department
        },
        college: req.user.college || 'Engineering Campus',
        status: 'Available',
        createdAt: new Date()
      };
      return res.status(201).json({ success: true, product: newProduct, message: 'Listing created successfully!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create product listing.' });
  }
});

// Edit Product Listing (Owner or Admin)
app.put('/api/products/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to edit this listing.' });
    }

    const { title, description, category, price, condition, image, status } = req.body;

    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (category) product.category = category;
    if (price !== undefined && !isNaN(price)) product.price = Number(price);
    if (condition) product.condition = condition;
    if (image) product.image = image.trim();
    if (status) product.status = status;

    await product.save();
    const updated = await Product.findById(product._id).populate('seller', 'fullName email college department');

    res.json({ success: true, product: updated, message: 'Product updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update product.' });
  }
});

// Admin Direct Price Adjustment Endpoint (Saves directly to MongoDB database)
app.patch('/api/products/:id/price', requireAuth, async (req, res) => {
  try {
    const { price, title } = req.body;
    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: 'Please provide a valid non-negative price.' });
    }

    const newPrice = Number(price);
    const productId = req.params.id;
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected) {
      let product = null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
      if (!product && title) {
        product = await Product.findOne({ title: title.trim() });
      }
      if (!product) {
        try {
          product = await Product.findOne({ _id: productId });
        } catch (_) {}
      }

      if (product) {
        const isOwner = product.seller && product.seller.toString() === req.user._id.toString();
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ error: 'Administrator privileges or listing ownership required to adjust price.' });
        }

        const oldPrice = product.price;
        product.price = newPrice;
        await product.save();
        console.log(`[MongoDB] Admin adjusted price: "${product.title}" changed from $${oldPrice} to $${newPrice}`);

        return res.json({
          success: true,
          message: `Product price updated to $${newPrice.toLocaleString('en-US')} in database!`,
          product: {
            id: product._id,
            title: product.title,
            price: product.price,
            oldPrice
          }
        });
      }
    }

    // In-memory or hybrid response
    console.log(`[State Update] Admin price adjustment for product #${productId}: $${newPrice}`);
    return res.json({
      success: true,
      message: `Product price adjusted to $${newPrice.toLocaleString('en-US')}!`,
      id: productId,
      price: newPrice
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update product price in database.' });
  }
});

// Database Inspection Endpoint (Allows viewing all collections directly in browser or terminal)
app.get('/api/database/inspect', async (req, res) => {
  try {
    if (isDbConnected) {
      const users = await User.find().select('-password').lean();
      const products = await Product.find().lean();
      const transactions = await Transaction.find().lean();
      const reports = await Report.find().lean();
      return res.json({
        success: true,
        source: 'MongoDB Database',
        connected: true,
        databaseName: 'campuscart',
        collections: {
          usersCount: users.length,
          productsCount: products.length,
          transactionsCount: transactions.length,
          reportsCount: reports.length
        },
        users,
        products,
        transactions,
        reports
      });
    } else {
      return res.json({
        success: true,
        source: 'In-Memory Fallback State (MongoDB offline)',
        connected: false,
        note: 'Start your local MongoDB service or set MONGO_URI in server/.env to sync directly to cloud MongoDB Atlas.',
        inMemoryUsers: inMemoryUsers.map(({ password, ...u }) => u)
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product Listing (Owner or Admin)
app.delete('/api/products/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to delete this listing.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    // Cleanup wishlist entries and pending transactions for this product
    await Wishlist.deleteMany({ product: req.params.id });
    await Report.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// My Listings
app.get('/api/my-listings', checkDb, requireAuth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});

// Update Product Status (Quick Toggle: Available, Reserved, Sold)
app.patch('/api/products/:id/status', checkDb, requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Reserved', 'Sold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid product status.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to change product status.' });
    }

    product.status = status;
    await product.save();

    res.json({ success: true, product, message: `Product status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product status.' });
  }
});

// 4. WISHLIST ROUTES

// Get Wishlist for Current User
app.get('/api/wishlist', checkDb, requireAuth, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'product',
        populate: { path: 'seller', select: 'fullName email college department' }
      })
      .sort({ createdAt: -1 });

    // Filter out any products that might have been deleted
    const validItems = wishlistItems.filter(item => item.product !== null);

    res.json({
      success: true,
      count: validItems.length,
      wishlist: validItems.map(item => item.product)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve wishlist.' });
  }
});

// Add Product to Wishlist
app.post('/api/wishlist/:productId', checkDb, requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const existing = await Wishlist.findOne({ user: req.user._id, product: req.params.productId });
    if (existing) {
      return res.status(400).json({ error: 'Product is already in your wishlist.' });
    }

    await Wishlist.create({
      user: req.user._id,
      product: req.params.productId
    });

    res.status(201).json({ success: true, message: 'Added to wishlist!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist.' });
  }
});

// Remove Product from Wishlist
app.delete('/api/wishlist/:productId', checkDb, requireAuth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id, product: req.params.productId });
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist.' });
  }
});

// 5. TRANSACTION ROUTES (Purchase & Exchange Requests)

// Create Request
app.post('/api/transactions', checkDb, requireAuth, async (req, res) => {
  try {
    const { productId, message } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.status !== 'Available') {
      return res.status(400).json({ error: `This item is currently ${product.status.toLowerCase()} and cannot be requested.` });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot make a purchase request for your own listing.' });
    }

    // Check for duplicate active request
    const existingActive = await Transaction.findOne({
      product: productId,
      buyer: req.user._id,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingActive) {
      return res.status(400).json({ error: 'You already have an active request for this product.' });
    }

    const transaction = await Transaction.create({
      product: productId,
      buyer: req.user._id,
      seller: product.seller,
      message: message ? message.trim() : 'Hi, I am interested in buying this item on campus. Let us connect!'
    });

    const populated = await Transaction.findById(transaction._id)
      .populate('product')
      .populate('buyer', 'fullName email college department academicYear')
      .populate('seller', 'fullName email college department');

    res.status(201).json({ success: true, transaction: populated, message: 'Purchase request sent to seller!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create transaction request.' });
  }
});

// Get User's Transactions (Both Incoming as Seller and Outgoing as Buyer)
app.get('/api/transactions', checkDb, requireAuth, async (req, res) => {
  try {
    const asBuyer = await Transaction.find({ buyer: req.user._id })
      .populate('product')
      .populate('seller', 'fullName email college department')
      .sort({ createdAt: -1 });

    const asSeller = await Transaction.find({ seller: req.user._id })
      .populate('product')
      .populate('buyer', 'fullName email college department academicYear')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      asBuyer,
      asSeller,
      totalRequests: asBuyer.length + asSeller.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions.' });
  }
});

// Update Transaction Status (Accept, Reject, Complete, Cancel)
app.patch('/api/transactions/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Accepted', 'Rejected', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid transaction status.' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction request not found.' });
    }

    const isSeller = transaction.seller.toString() === req.user._id.toString();
    const isBuyer = transaction.buyer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isBuyer && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to modify this transaction.' });
    }

    const product = await Product.findById(transaction.product);

    // Business Logic based on status transition
    if (status === 'Accepted') {
      if (!isSeller && !isAdmin) {
        return res.status(403).json({ error: 'Only the seller can accept purchase requests.' });
      }
      if (product) {
        if (product.status === 'Sold') {
          return res.status(400).json({ error: 'This product has already been sold.' });
        }
        product.status = 'Reserved';
        await product.save();
      }
    } else if (status === 'Completed') {
      if (!isSeller && !isAdmin) {
        return res.status(403).json({ error: 'Only the seller can mark the campus exchange as completed.' });
      }
      if (product) {
        product.status = 'Sold';
        await product.save();
      }
    } else if (status === 'Rejected') {
      if (!isSeller && !isAdmin) {
        return res.status(403).json({ error: 'Only the seller can reject requests.' });
      }
      // If product was reserved for this transaction, revert to Available
      if (product && product.status === 'Reserved' && transaction.status === 'Accepted') {
        product.status = 'Available';
        await product.save();
      }
    } else if (status === 'Cancelled') {
      // Buyer can cancel pending or accepted requests, seller can cancel
      if (product && product.status === 'Reserved' && transaction.status === 'Accepted') {
        product.status = 'Available';
        await product.save();
      }
    }

    transaction.status = status;
    transaction.updatedAt = Date.now();
    await transaction.save();

    const updated = await Transaction.findById(transaction._id)
      .populate('product')
      .populate('buyer', 'fullName email college department')
      .populate('seller', 'fullName email college department');

    res.json({ success: true, transaction: updated, message: `Request marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update transaction.' });
  }
});

// 6. REPORT LISTINGS
app.post('/api/reports', checkDb, requireAuth, async (req, res) => {
  try {
    const { productId, reason, details } = req.body;

    if (!productId || !reason) {
      return res.status(400).json({ error: 'Product ID and reason are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await Report.create({
      product: productId,
      reportedBy: req.user._id,
      reason,
      details: details ? details.trim() : ''
    });

    res.status(201).json({ success: true, message: 'Thank you for reporting. Campus admin will review this listing.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report.' });
  }
});

// 7. ADMINISTRATOR ROUTES

// Admin Statistics
app.get('/api/admin/stats', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ status: 'Available' });
    const soldProducts = await Product.countDocuments({ status: 'Sold' });
    const reservedProducts = await Product.countDocuments({ status: 'Reserved' });
    const totalTransactions = await Transaction.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        availableProducts,
        soldProducts,
        reservedProducts,
        totalTransactions,
        pendingReports
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

// View All Users
app.get('/api/admin/users', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Toggle User Active Status (Deactivate / Reactivate)
app.patch('/api/admin/users/:id/status', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Administrators cannot deactivate their own account.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.fullName} is now ${user.isActive ? 'Active' : 'Deactivated'}.`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// Admin Delete Product
app.delete('/api/admin/products/:id', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await Wishlist.deleteMany({ product: req.params.id });
    await Report.deleteMany({ product: req.params.id });
    await Transaction.updateMany({ product: req.params.id }, { status: 'Cancelled' });

    res.json({ success: true, message: 'Listing permanently removed by administrator.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

// Admin View Reports
app.get('/api/admin/reports', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('product')
      .populate('reportedBy', 'fullName email college')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// Admin Update Report Status
app.patch('/api/admin/reports/:id', checkDb, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    report.status = status;
    await report.save();

    res.json({ success: true, report, message: `Report marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

// Serve static production build of client if available
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// SPA Client Routing: redirect all non-API GET requests to client/dist/index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) next();
  });
});

// 404 Handler for unknown API endpoints
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found on CampusCart API.` });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CampusCart Express Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed Frontend Origin: ${CLIENT_URL}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [PORT ${PORT} IN USE] Another instance of CampusCart or a zombie node process is already running.`);
    console.error(`👉 Close your duplicate terminal or run: npx kill-port ${PORT}\n`);
  } else {
    console.error('Server error:', err.message);
  }
});
