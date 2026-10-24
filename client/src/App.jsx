import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  ShoppingCart, Search, Heart, User, Star, ChevronDown, Check,
  Truck, RotateCcw, X, Plus, Minus, ArrowRight, ShieldCheck,
  CreditCard, MapPin, Phone, Eye, EyeOff, SlidersHorizontal,
  Package, Trash2, ArrowLeft, CheckCircle2,
  BookOpen, Bike, Layers, Tag, MessageSquare, ShieldAlert, Edit3, AlertTriangle, Send,
  Navigation, Crosshair, Globe, ExternalLink, Loader2, Compass, Receipt,
  Lock, LogIn, LogOut, UserPlus, Shield, Calculator, FileText, GraduationCap
} from './icons.jsx';
import TermsModal from './components/TermsModal.jsx';
import PrivacyModal from './components/PrivacyModal.jsx';
import ResaleCalculatorModal from './components/ResaleCalculatorModal.jsx';
import CampusExchangeLedger from './components/CampusExchangeLedger.jsx';
import { CatalogGridSkeleton } from './components/SkeletonLoader.jsx';

// ==========================================
// CURRENCY HELPER
// ==========================================
const formatPrice = (amount) => {
  const num = Number(amount || 0);
  return '₹' + num.toLocaleString('en-IN');
};
const formatINR = formatPrice;

// ==========================================
// CAMPUSCART INITIAL DATASET (Catalog & Exact Geocoding)
// ==========================================

const INITIAL_CAMPUS_PRODUCTS = [
  {
    id: 'cc-1',
    title: 'Wireless Earbuds, IPX8 ANC',
    price: 2290,
    rating: 5,
    reviewsCount: 121,
    description: 'Active Noise Cancellation & 32h battery case',
    longDescription: 'High-performance noise-cancelling in-ear earbuds perfect for library study sessions, campus walks, and gym workouts. Includes wireless charging case with 32h battery life.',
    category: 'Electronics',
    type: 'Earbuds',
    condition: 'Like New',
    college: 'Engineering Campus',
    pickupLocation: 'Engineering Education Complex - Tech Quad',
    coordinates: { lat: 30.2882, lng: -97.7356 },
    seller: {
      name: 'Savio Morcos',
      role: 'student',
      studentId: '24BCE327',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      email: 'savio.cse@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Space Gray',
    colorHex: '#1e293b',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Space Gray', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80' },
      { name: 'Pure White', hex: '#f8fafc', img: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-2',
    title: 'AirPods Max',
    price: 24990,
    monthlyPrice: 2199,
    rating: 5,
    reviewsCount: 121,
    description: 'A perfect balance of high-fidelity audio',
    longDescription: 'A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods. Ultimate personal listening experience with active noise cancellation and spatial audio for distraction-free campus study.',
    category: 'Electronics',
    type: 'Over-Ear',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Central Library - 2nd Floor Study Lounge',
    coordinates: { lat: 30.2849, lng: -97.7341 },
    seller: {
      name: 'Sarah Chen',
      role: 'student',
      studentId: '24BCE327',
      department: 'Information Technology',
      year: '2nd Year',
      email: 'sarah.it@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Coral Pink',
    colorHex: '#e17076',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Coral Pink', hex: '#e17076', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Space Gray', hex: '#374151', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Pastel Mint', hex: '#bbf7d0', img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80' },
      { name: 'Silver White', hex: '#e2e8f0', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sky Blue', hex: '#38bdf8', img: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: '50% Off',
    status: 'Available',
    featured: true,
    isHero: true
  },
  {
    id: 'cc-3',
    title: 'TI-84 Plus CE Graphing Calculator',
    price: 4490,
    rating: 5,
    reviewsCount: 121,
    description: 'High-res color backlit screen with rechargeable battery',
    longDescription: 'Essential for Calculus, Engineering Mathematics, and Physics coursework. Preloaded with engineering apps and includes USB charging cable.',
    category: 'Calculators',
    type: 'Calculators',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'Mathematics Building Foyer - Hall A',
    coordinates: { lat: 30.2875, lng: -97.7365 },
    seller: {
      name: 'Alex Rivera',
      role: 'student',
      studentId: '23BME112',
      department: 'Mechanical Engineering',
      year: '3rd Year',
      email: 'alex.me@campus.edu',
      verified: true
    },
    stock: 2,
    color: 'Black',
    colorHex: '#0f172a',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Black', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-4',
    title: 'VIVEFOX Wired Headphone',
    price: 2190,
    rating: 5,
    reviewsCount: 121,
    description: 'Wired Stereo Headsets With Mic for Online Lectures',
    longDescription: 'Lightweight on-ear stereo headphones with inline mic, tangle-free braided cable, ideal for Zoom calls, coding sessions, and podcast listening.',
    category: 'Electronics',
    type: 'On-Ear',
    condition: 'Like New',
    college: 'North Campus',
    pickupLocation: 'Student Union Hub Cafeteria',
    coordinates: { lat: 30.2861, lng: -97.7392 },
    seller: {
      name: 'Priya Sharma',
      role: 'student',
      studentId: '24BCE198',
      department: 'Computer Science',
      year: '1st Year',
      email: 'priya.cs@campus.edu',
      verified: true
    },
    stock: 3,
    color: 'Crimson Red',
    colorHex: '#ef4444',
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Crimson Red', hex: '#ef4444', img: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: '50% Off',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-5',
    title: 'JBL TUNE 600BTNC',
    price: 2990,
    rating: 5,
    reviewsCount: 121,
    description: 'Active Noise Cancelling Bluetooth On-Ear Headphone',
    longDescription: 'Compact active noise-cancelling wireless on-ear headphones with signature JBL Pure Bass sound. Perfect condition, used for one semester.',
    category: 'Electronics',
    type: 'Over-Ear',
    condition: 'Good',
    college: 'Business School',
    pickupLocation: 'Business School Quad - Hall of Honors',
    coordinates: { lat: 30.2838, lng: -97.7381 },
    seller: {
      name: 'David Kim',
      role: 'student',
      studentId: '23BBA045',
      department: 'Business Administration',
      year: '2nd Year',
      email: 'david.bba@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Matte Black',
    colorHex: '#18181b',
    image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Matte Black', hex: '#18181b', img: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-6',
    title: 'Organic Chemistry 4th Ed + Notes',
    price: 480,
    rating: 5,
    reviewsCount: 121,
    description: 'Hardcover textbook with handwritten lecture notes & summary',
    longDescription: 'Original hardcover copy of Organic Chemistry 4th edition. No missing pages, highlighted key mechanisms, and comes with a 40-page spiral-bound exam review sheet.',
    category: 'Books & Notes',
    type: 'Books & Notes',
    condition: 'Good',
    college: 'Science Quad',
    pickupLocation: 'Welch Chemistry Hall - Room 102',
    coordinates: { lat: 30.2869, lng: -97.7378 },
    seller: {
      name: 'Emily Watson',
      role: 'student',
      studentId: '22BSC310',
      department: 'Chemistry',
      year: '4th Year',
      email: 'emily.chem@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Blue',
    colorHex: '#0284c7',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Hardcover', hex: '#0284c7', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: '50% Off',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-7',
    title: 'Trek Speed 21-Speed Campus Bicycle',
    price: 4850,
    rating: 5,
    reviewsCount: 121,
    description: 'All-terrain campus commuter bike with U-lock included',
    longDescription: 'Reliable 21-gear bicycle tuned up recently. New brake pads, smooth shifting, comfortable saddle, and includes a heavy-duty Kryptonite U-lock.',
    category: 'Bicycles',
    type: 'Bicycles',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'San Jacinto Dormitory Bike Rack',
    coordinates: { lat: 30.2825, lng: -97.7328 },
    seller: {
      name: 'Marcus Vance',
      role: 'student',
      studentId: '22BCE156',
      department: 'Civil Engineering',
      year: '4th Year',
      email: 'marcus.ce@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Graphite',
    colorHex: '#334155',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'Graphite', hex: '#334155', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-8',
    title: 'Lab Coat & Digital Multimeter Kit',
    price: 650,
    rating: 5,
    reviewsCount: 121,
    description: 'Cotton 100% lab coat (Size M) + precision digital multimeter',
    longDescription: 'Standard issue white campus lab coat with safety goggles and an auto-ranging digital multimeter with probes. Used for 1st year electrical/chemistry lab.',
    category: 'Lab Equipment',
    type: 'Lab Equipment',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Painter Physics Hall Main Entrance',
    coordinates: { lat: 30.2888, lng: -97.7371 },
    seller: {
      name: 'Rohan Mehra',
      role: 'student',
      studentId: '24BEE089',
      department: 'Electrical Engineering',
      year: '1st Year',
      email: 'rohan.ee@campus.edu',
      verified: true
    },
    stock: 2,
    color: 'White',
    colorHex: '#f1f5f9',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    colorVariants: [
      { name: 'White', hex: '#f1f5f9', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
    ],
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-9',
    title: 'Hostel Study Desk & Ergonomic Chair',
    price: 1650,
    rating: 5,
    reviewsCount: 48,
    description: 'Compact engineered wood desk with bookshelf + mesh chair',
    longDescription: 'Spacious study table ideal for laptop and textbook study in campus dorms. Lightweight, easy to dismantle and move between hostel rooms. Includes breathable ergonomic chair.',
    category: 'Furniture',
    type: 'Furniture',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'Hostel Block 3 Ground Floor Quad',
    coordinates: { lat: 30.2855, lng: -97.7365 },
    seller: {
      name: 'Parv',
      role: 'student',
      studentId: '24BCE327',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      email: 'student@campuscart.edu',
      verified: true
    },
    stock: 1,
    color: 'Oak Wood',
    colorHex: '#854d0e',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-10',
    title: 'Foldable Bed Study Table with Tablet Holder',
    price: 490,
    rating: 5,
    reviewsCount: 34,
    description: 'Anti-slip multipurpose bed desk for late night study',
    longDescription: 'High quality MDF wood bed table with built-in tablet slot and cup holder. Folds completely flat for storage under hostel beds. Barely used for 2 months.',
    category: 'Furniture',
    type: 'Furniture',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Student Union Lounge',
    coordinates: { lat: 30.2861, lng: -97.7392 },
    seller: {
      name: 'Aditya Sen',
      role: 'student',
      studentId: '24BME055',
      department: 'Mechanical Engineering',
      year: '2nd Year',
      email: 'aditya.me@campus.edu',
      verified: true
    },
    stock: 2,
    color: 'Walnut Black',
    colorHex: '#1f2937',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    offer: 'Student Listing',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-11',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    price: 950,
    rating: 5,
    reviewsCount: 88,
    description: '552 functions, natural textbook display, solar + battery',
    longDescription: 'Essential scientific calculator for engineering mechanics, calculus, matrices, and university semester exams. Clean protective cover included.',
    category: 'Calculators',
    type: 'Calculators',
    condition: 'Like New',
    college: 'Engineering Campus',
    pickupLocation: 'Tech Quad Center',
    coordinates: { lat: 30.2882, lng: -97.7356 },
    seller: {
      name: 'Parv',
      role: 'student',
      studentId: '24BCE327',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      email: 'student@campuscart.edu',
      verified: true
    },
    stock: 1,
    color: 'Carbon Black',
    colorHex: '#111827',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-12',
    title: 'Higher Engineering Mathematics - B.S. Grewal (44th Ed)',
    price: 420,
    rating: 5,
    reviewsCount: 76,
    description: 'Standard textbook for 1st/2nd year B.Tech calculus & linear algebra',
    longDescription: 'All semester exam practice problems and solutions included. Neat pages, clean spine, with formula reference sheets included.',
    category: 'Books & Notes',
    type: 'Books & Notes',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'Central Library Ground Floor',
    coordinates: { lat: 30.2849, lng: -97.7341 },
    seller: {
      name: 'Neha Verma',
      role: 'student',
      studentId: '24ECE104',
      department: 'Electronics & Communication',
      year: '2nd Year',
      email: 'neha.ece@campus.edu',
      verified: true
    },
    stock: 1,
    color: 'Paperback',
    colorHex: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    offer: '50% Off',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-13',
    title: 'Firefox Target 21-Speed Mountain Bicycle',
    price: 5490,
    rating: 5,
    reviewsCount: 42,
    description: 'Dual disc brakes, front suspension, smooth gear shifts',
    longDescription: 'Rugged campus bicycle with bottle holder, bell, and number lock. Great for commuting between hostel, sports ground, and departments.',
    category: 'Bicycles',
    type: 'Bicycles',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'Main Campus Gate Parking',
    coordinates: { lat: 30.2840, lng: -97.7330 },
    seller: {
      name: 'Parv',
      role: 'student',
      studentId: '24BCE327',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      email: 'student@campuscart.edu',
      verified: true
    },
    stock: 1,
    color: 'Matte Blue',
    colorHex: '#1e3a8a',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    offer: 'Special Deal',
    status: 'Available',
    featured: true
  },
  {
    id: 'cc-14',
    title: 'Precision Vernier Caliper & Micrometer Screw Gauge',
    price: 580,
    rating: 5,
    reviewsCount: 29,
    description: 'Stainless steel 150mm vernier caliper with hard protective case',
    longDescription: 'High precision 0.02mm graduation vernier caliper + 0-25mm screw gauge for university physics and mechanical engineering workshops.',
    category: 'Lab Equipment',
    type: 'Lab Equipment',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Mechanical Workshop Hall',
    coordinates: { lat: 30.2875, lng: -97.7360 },
    seller: {
      name: 'Parv',
      role: 'student',
      studentId: '24BCE327',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      email: 'student@campuscart.edu',
      verified: true
    },
    stock: 1,
    color: 'Stainless Steel',
    colorHex: '#94a3b8',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    offer: 'Student Listing',
    status: 'Available',
    featured: true
  }
];

const SIMILAR_ITEMS = [
  {
    id: 'sim-1',
    title: 'Gaming Headphone',
    price: 2690,
    rating: 5,
    reviewsCount: 121,
    description: 'Noise-cancelling mic with RGB lighting for esports',
    category: 'Electronics',
    condition: 'Like New',
    college: 'Engineering Campus',
    pickupLocation: 'Engineering Annex',
    coordinates: { lat: 30.2885, lng: -97.7360 },
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sim-2',
    title: 'Macbook pro 13"',
    price: 38500,
    rating: 5,
    reviewsCount: 121,
    description: 'Apple Silicon, 256GB SSD, 8GB RAM with MagSafe Charger',
    category: 'Electronics',
    condition: 'Good',
    college: 'Business School',
    pickupLocation: 'Business Hall',
    coordinates: { lat: 30.2838, lng: -97.7381 },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sim-3',
    title: 'HomePod mini',
    price: 4890,
    rating: 5,
    reviewsCount: 121,
    description: 'Compact 360-degree smart speaker for dorm room',
    category: 'Electronics',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Science Building',
    coordinates: { lat: 30.2869, lng: -97.7378 },
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sim-4',
    title: 'Laptop sleeve MacBook',
    price: 750,
    rating: 5,
    reviewsCount: 121,
    description: 'Organic Cotton, shockproof padding, fairtrade certified',
    category: 'Other Essentials',
    condition: 'New',
    college: 'North Campus',
    pickupLocation: 'Student Union Hub',
    coordinates: { lat: 30.2861, lng: -97.7392 },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  }
];

const RECENTLY_VIEWED = [
  {
    id: 'rec-1',
    title: 'Laptop sleeve MacBook',
    price: 750,
    rating: 5,
    reviewsCount: 121,
    description: 'Organic Cotton, fairtrade certified',
    category: 'Other Essentials',
    condition: 'New',
    college: 'North Campus',
    pickupLocation: 'Student Union Hub',
    coordinates: { lat: 30.2861, lng: -97.7392 },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-2',
    title: 'AirPods Max',
    price: 24990,
    rating: 5,
    reviewsCount: 121,
    description: 'A perfect balance of high-fidelity audio',
    category: 'Electronics',
    condition: 'Like New',
    college: 'Science Quad',
    pickupLocation: 'Central Library Lounge',
    coordinates: { lat: 30.2849, lng: -97.7341 },
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    highlightButton: true
  },
  {
    id: 'rec-3',
    title: 'Ipad Mini',
    price: 22900,
    rating: 5,
    reviewsCount: 121,
    description: 'Wi-Fi 64GB with Apple Pencil support for digital note taking',
    category: 'Electronics',
    condition: 'Good',
    college: 'Engineering Campus',
    pickupLocation: 'Tech Quad',
    coordinates: { lat: 30.2882, lng: -97.7356 },
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-4',
    title: 'Flower Laptop Sleeve',
    price: 590,
    rating: 5,
    reviewsCount: 121,
    description: '15 in. x 10 in. flap top closure protective sleeve',
    category: 'Other Essentials',
    condition: 'Like New',
    college: 'North Campus',
    pickupLocation: 'Student Union Hub',
    coordinates: { lat: 30.2861, lng: -97.7392 },
    image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80'
  }
];

const POPULAR_CATEGORIES = [
  { name: 'Books & Notes', displayName: 'Textbooks & Notes', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
  { name: 'Calculators', displayName: 'Calculators', img: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=300&q=80' },
  { name: 'Electronics', displayName: 'Headphones & Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Bicycles', displayName: 'Bicycles & Mobility', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Lab Equipment', displayName: 'Lab Coats & Equipment', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80' },
  { name: 'Furniture', displayName: 'Hostel Furniture', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_CAMPUS_PRODUCTS[1]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Authentication & Student State
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('campuscart_token') || '';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campuscart_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Automatically migrate demo student identity to Parv (24BCE327)
        if (parsed.email === 'student@campuscart.edu' || parsed.fullName === 'Rahul Sharma' || parsed.studentId === '24BCE321') {
          parsed.fullName = 'Parv';
          parsed.studentId = '24BCE327';
          localStorage.setItem('campuscart_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authStudentId, setAuthStudentId] = useState('');
  const [authDepartment, setAuthDepartment] = useState('Computer Science and Engineering');
  const [authCollege, setAuthCollege] = useState('National Institute of Technology');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Geocoding Exact Location State
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('campuscart_geocoded_location');
      return saved ? JSON.parse(saved) : {
        displayName: 'Central Library, University Quad, Austin, TX 78712, United States',
        building: 'Central Library',
        road: 'University Quad',
        city: 'Austin',
        state: 'Texas',
        postcode: '78712',
        country: 'United States',
        lat: 30.2849,
        lng: -97.7341,
        isGpsDetected: false
      };
    } catch {
      return {
        displayName: 'Central Library, University Quad, Austin, TX 78712, United States',
        building: 'Central Library',
        road: 'University Quad',
        city: 'Austin',
        state: 'Texas',
        postcode: '78712',
        country: 'United States',
        lat: 30.2849,
        lng: -97.7341,
        isGpsDetected: false
      };
    }
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geocodeQuery, setGeocodeQuery] = useState('');
  const [geocodeSuggestions, setGeocodeSuggestions] = useState([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // Active University State (Persistent & Scoped per Campus)
  const [activeUniversity, setActiveUniversity] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('campuscart_user') || 'null');
      if (savedUser?.college) return savedUser.college;
      return localStorage.getItem('campuscart_university') || 'National Institute of Technology';
    } catch {
      return 'National Institute of Technology';
    }
  });
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [universityInput, setUniversityInput] = useState('');

  // All Products State - Automatically update to realistic Indian market prices while preserving custom listings
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('campuscart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        const initialMap = new Map(INITIAL_CAMPUS_PRODUCTS.map(p => [p.id, p]));
        // If cached items contain outdated unrealistically low prices (e.g. cc-1 < 1000 or cc-2 < 10000)
        const hasOutdatedPricing = parsed.some(p => (p.id === 'cc-1' && p.price < 1000) || (p.id === 'cc-2' && p.price < 10000));

        let merged = parsed;
        if (hasOutdatedPricing) {
          merged = parsed.map(p => {
            if (initialMap.has(p.id)) {
              const fresh = initialMap.get(p.id);
              return { ...p, price: fresh.price, monthlyPrice: fresh.monthlyPrice, title: fresh.title, description: fresh.description };
            }
            return p;
          });
        }

        const existingIds = new Set(merged.map(p => p.id));
        let hasNew = hasOutdatedPricing;
        INITIAL_CAMPUS_PRODUCTS.forEach(item => {
          if (!existingIds.has(item.id)) {
            merged.push(item);
            hasNew = true;
          }
        });
        if (hasNew) {
          localStorage.setItem('campuscart_products', JSON.stringify(merged));
        }
        return merged;
      }
      return INITIAL_CAMPUS_PRODUCTS;
    } catch {
      return INITIAL_CAMPUS_PRODUCTS;
    }
  });

  // Cart & Wishlist State (User-Isolated)
  const [cart, setCart] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('campuscart_user') || 'null');
      if (savedUser?.email) {
        const saved = localStorage.getItem(`campuscart_cart_${savedUser.email}`);
        if (saved) return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('campuscart_user') || 'null');
      if (savedUser?.email) {
        const saved = localStorage.getItem(`campuscart_wishlist_${savedUser.email}`);
        if (saved) return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Transactions State (User-Isolated Orders)
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('campuscart_user') || 'null');
      if (savedUser?.email) {
        const saved = localStorage.getItem(`campuscart_transactions_${savedUser.email}`);
        if (saved) return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Inappropriate Listings Reports (Admin Dashboard)
  const [reports, setReports] = useState([
    {
      id: 'REP-101',
      productTitle: 'Non-compliant Lab Chemical Sample',
      reportedBy: 'Alex Rivera (23BME112)',
      reason: 'Prohibited chemical item not permitted on campus student exchange',
      status: 'Pending'
    }
  ]);

  // UI Modals, Drawers & Tabs
  const [accountTab, setAccountTab] = useState('listings'); // 'listings' | 'transactions'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // Admin Price Adjustment State (Direct MongoDB Sync)
  const [adminPriceDrafts, setAdminPriceDrafts] = useState({});
  const [adminPriceUpdatingId, setAdminPriceUpdatingId] = useState(null);
  const [isAdminPriceModalOpen, setIsAdminPriceModalOpen] = useState(false);
  const [adminPriceModalProduct, setAdminPriceModalProduct] = useState(null);
  const [adminPriceModalInput, setAdminPriceModalInput] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterCollege, setFilterCollege] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOffer, setFilterOffer] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');

  // Trigger smooth skeleton loading state on search/filter changes
  useEffect(() => {
    setIsCatalogLoading(true);
    const timer = setTimeout(() => setIsCatalogLoading(false), 240);
    return () => clearTimeout(timer);
  }, [selectedCategory, filterPrice, filterCondition, filterCollege, filterStatus, filterOffer, searchQuery, sortBy]);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'Books & Notes',
    price: '',
    condition: 'Like New',
    college: 'Engineering Campus',
    pickupLocation: 'Central Library Lobby',
    lat: 30.2849,
    lng: -97.7341,
    description: '',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  });

  // Checkout Form State (Dynamic with logged-in student)
  const [checkoutData, setCheckoutData] = useState({
    name: currentUser?.fullName || currentUser?.name || '',
    studentId: currentUser?.studentId || '',
    college: currentUser?.college || 'National Institute of Technology',
    pickupLocation: 'Central Library Lobby - 1st Floor Desk',
    lat: 30.2849,
    lng: -97.7341,
    mobile: currentUser?.mobile || '',
    email: currentUser?.email || '',
    paymentMethod: 'cash_on_meetup'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState({});

  // Sync checkout data whenever logged-in user changes
  useEffect(() => {
    if (currentUser) {
      setCheckoutData(prev => ({
        ...prev,
        name: currentUser.fullName || currentUser.name || prev.name,
        studentId: currentUser.studentId || prev.studentId,
        college: currentUser.college || prev.college,
        email: currentUser.email || prev.email,
        mobile: currentUser.mobile || prev.mobile
      }));
    }
  }, [currentUser]);

  // Verify auth session token on mount
  useEffect(() => {
    const verifyAuthSession = async () => {
      const storedToken = localStorage.getItem('campuscart_token');
      if (!storedToken) return;
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.data?.success && res.data.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem('campuscart_user', JSON.stringify(res.data.user));
          if (res.data.user.college) {
            setActiveUniversity(res.data.user.college);
          }
        }
      } catch (err) {
        console.warn('Session check note:', err.message);
      }
    };
    verifyAuthSession();
  }, []);

  // Dynamic MongoDB Database Sync Functions
  const fetchProducts = async (univ = activeUniversity) => {
    setIsCatalogLoading(true);
    try {
      const res = await axios.get('/api/products', {
        params: { college: univ }
      });
      if (res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        const dbProducts = res.data.products.map(p => ({
          ...p,
          id: p._id || p.id,
          rating: p.rating || 5,
          reviewsCount: p.reviewsCount || 42,
          pickupLocation: p.location?.address || `${univ} Campus Hub`,
          coordinates: p.location?.coordinates || { lat: 30.2849, lng: -97.7341 }
        }));
        setProducts(dbProducts);
        localStorage.setItem('campuscart_products', JSON.stringify(dbProducts));
      } else {
        // Fallback: if no specific products for this university yet, query all products to seed or browse
        const resAll = await axios.get('/api/products');
        if (resAll.data?.success && Array.isArray(resAll.data.products) && resAll.data.products.length > 0) {
          const matching = resAll.data.products.filter(p => 
            (p.college && p.college.toLowerCase().includes(univ.toLowerCase())) ||
            (univ.toLowerCase().includes(p.college?.toLowerCase() || ''))
          );
          const toUse = matching.length > 0 ? matching : resAll.data.products;
          const mapped = toUse.map(p => ({
            ...p,
            id: p._id || p.id,
            rating: p.rating || 5,
            reviewsCount: p.reviewsCount || 42,
            pickupLocation: p.location?.address || `${univ} Campus Hub`,
            coordinates: p.location?.coordinates || { lat: 30.2849, lng: -97.7341 }
          }));
          setProducts(mapped);
        }
      }
    } catch (err) {
      console.warn('Backend product fetch notice:', err.message);
    } finally {
      setIsCatalogLoading(false);
    }
  };

  const fetchWishlist = async (customToken) => {
    const token = customToken || localStorage.getItem('campuscart_token') || authToken;
    if (!token) return;
    try {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && Array.isArray(res.data.wishlist)) {
        const ids = res.data.wishlist.map(p => p._id || p.id);
        setWishlist(ids);
      }
    } catch (err) {
      console.warn('Backend wishlist fetch notice:', err.message);
    }
  };

  const fetchTransactions = async (customToken) => {
    const token = customToken || localStorage.getItem('campuscart_token') || authToken;
    if (!token) return;
    try {
      const res = await axios.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        const allTxns = [...(res.data.asBuyer || []), ...(res.data.asSeller || [])];
        const formatted = allTxns.map(t => ({
          id: t._id,
          _id: t._id,
          itemTitle: t.product?.title || 'Campus Item',
          productTitle: t.product?.title || 'Campus Item',
          sellerName: t.seller?.fullName || 'Campus Seller',
          buyerName: t.buyer?.fullName || 'Fellow Student',
          price: t.product?.price || 0,
          status: t.status || 'Pending',
          date: new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          pickupSpot: t.deliveryLocation?.address || 'Campus Hand-Off Hub',
          coordinates: t.deliveryLocation?.coordinates || { lat: 30.2849, lng: -97.7341 },
          buyerEmail: t.buyer?.email,
          sellerEmail: t.seller?.email
        }));
        setTransactions(formatted);
      }
    } catch (err) {
      console.warn('Backend transactions fetch notice:', err.message);
    }
  };

  // Synchronize on mount and active university change
  useEffect(() => {
    fetchProducts(activeUniversity);
  }, [activeUniversity]);

  useEffect(() => {
    const token = localStorage.getItem('campuscart_token') || authToken;
    if (token) {
      fetchWishlist(token);
      fetchTransactions(token);
    }
  }, [authToken, currentUser]);

  const handleSelectUniversity = async (univName) => {
    const finalUniv = (univName || universityInput).trim();
    if (!finalUniv) {
      showToast('Please enter or select a university', 'error');
      return;
    }

    setActiveUniversity(finalUniv);
    localStorage.setItem('campuscart_university', finalUniv);

    // If student is authenticated, update college in MongoDB profile
    const token = localStorage.getItem('campuscart_token') || authToken;
    if (token && currentUser) {
      try {
        const res = await axios.put('/api/auth/profile', {
          college: finalUniv
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success && res.data.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem('campuscart_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Failed to update college in backend profile:', err.message);
      }
    }

    setIsUniversityModalOpen(false);
    fetchProducts(finalUniv);
    showToast(`Switched to ${finalUniv} Marketplace!`);
  };

  const handleBuyNow = (product) => {
    if (!currentUser) {
      showToast('Please sign in to buy items', 'error');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    // Add product to cart if not present
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev;
      }
      return [{
        ...product,
        quantity: 1,
        selectedColor: product.color || 'Default'
      }, ...prev];
    });
    // Direct checkout navigation
    setCheckoutErrors({});
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Proceeding to checkout for "${product.title}"`);
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    if (!currentUser) {
      showToast('Please sign in to place an order', 'error');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }

    // Strict validation for all mandatory delivery information fields
    const errors = {};
    if (!checkoutData.name || !checkoutData.name.trim()) {
      errors.name = 'Student Full Name is required';
    }
    if (!checkoutData.studentId || !checkoutData.studentId.trim()) {
      errors.studentId = 'Student Roll Number / ID is required';
    }
    if (!checkoutData.pickupLocation || !checkoutData.pickupLocation.trim()) {
      errors.pickupLocation = 'Campus meetup point is required';
    }
    if (!checkoutData.college || !checkoutData.college.trim()) {
      errors.college = 'College / Campus Wing is required';
    }
    if (!checkoutData.mobile || !checkoutData.mobile.trim()) {
      errors.mobile = 'Mobile Phone number is required';
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(checkoutData.mobile.trim())) {
      errors.mobile = 'Please enter a valid phone number (at least 8-10 digits)';
    }
    if (!checkoutData.email || !checkoutData.email.trim()) {
      errors.email = 'University Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email.trim())) {
      errors.email = 'Please enter a valid university email address';
    }

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      showToast('Please fill in all mandatory required fields (*)', 'error');
      const formEl = document.getElementById('checkout-delivery-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setCheckoutErrors({});

    try {
      const storedToken = localStorage.getItem('campuscart_token') || authToken;
      const res = await axios.post('/api/transactions', {
        items: cart,
        deliveryLocation: {
          address: checkoutData.pickupLocation || 'Central Campus Library Desk',
          city: activeUniversity,
          coordinates: { lat: checkoutData.lat || 30.2849, lng: checkoutData.lng || -97.7341 }
        },
        paymentMethod: checkoutData.paymentMethod || 'cash_on_meetup',
        message: `Order for: ${cart.map(i => i.title).join(', ')}`
      }, {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
      });

      if (res.data?.success) {
        const createdList = res.data.transactions || (res.data.transaction ? [res.data.transaction] : []);
        const formatted = createdList.map(t => ({
          id: t._id,
          _id: t._id,
          itemTitle: t.product?.title || cart[0]?.title || 'Campus Item',
          productTitle: t.product?.title || cart[0]?.title || 'Campus Item',
          sellerName: t.seller?.fullName || 'Fellow Student',
          buyerName: currentUser.fullName,
          price: t.product?.price || finalTotal,
          status: t.status || 'Pending',
          date: 'Just now',
          pickupSpot: checkoutData.pickupLocation || 'Campus Hand-Off Spot',
          coordinates: { lat: checkoutData.lat, lng: checkoutData.lng },
          buyerEmail: currentUser.email
        }));

        setTransactions(prev => [...formatted, ...prev]);
        setOrderPlaced(true);
        showToast('Campus order placed & saved to database!');
      } else {
        setOrderPlaced(true);
        showToast('Campus order placed!');
      }
    } catch (err) {
      console.warn('Backend transaction notice:', err.message);
      const fallbackTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        itemTitle: cart[0]?.title || 'Campus Item',
        sellerName: cart[0]?.seller?.name || 'Fellow Student',
        price: finalTotal,
        status: 'Pending',
        date: 'Just now',
        pickupSpot: checkoutData.pickupLocation || 'Campus Hand-Off Spot',
        coordinates: { lat: checkoutData.lat, lng: checkoutData.lng },
        buyerEmail: currentUser.email
      };
      setTransactions(prev => [fallbackTxn, ...prev]);
      setOrderPlaced(true);
      showToast('Campus order placed successfully!');
    }
  };

  // Sync state to LocalStorage (Scoped per user)
  useEffect(() => {
    try {
      localStorage.setItem('campuscart_products', JSON.stringify(products));
      if (currentUser?.email) {
        localStorage.setItem(`campuscart_cart_${currentUser.email}`, JSON.stringify(cart));
        localStorage.setItem(`campuscart_wishlist_${currentUser.email}`, JSON.stringify(wishlist));
        localStorage.setItem(`campuscart_transactions_${currentUser.email}`, JSON.stringify(transactions));
      }
      localStorage.setItem('campuscart_geocoded_location', JSON.stringify(currentLocation));
    } catch (e) {
      console.warn('Storage sync warning', e);
    }
  }, [products, cart, wishlist, transactions, currentLocation, currentUser]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Geocoding API Handlers
  const detectExactLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsDetectingLocation(true);
    showToast('Acquiring precise GPS coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          let resolvedLocation = null;
          try {
            const res = await axios.get(`/api/geocode/reverse?lat=${latitude}&lng=${longitude}`);
            if (res.data?.success) {
              resolvedLocation = {
                displayName: res.data.displayName,
                building: res.data.building || res.data.road || 'Current Campus Location',
                road: res.data.road || 'Campus Way',
                city: res.data.city || 'Austin',
                state: res.data.state || 'Texas',
                postcode: res.data.postcode || '78712',
                country: res.data.country || 'United States',
                lat: parseFloat(res.data.lat || latitude),
                lng: parseFloat(res.data.lng || longitude),
                isGpsDetected: true
              };
            }
          } catch (apiErr) {
            const fallbackRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
              { headers: { 'Accept': 'application/json' } }
            );
            const json = await fallbackRes.json();
            if (json && !json.error) {
              resolvedLocation = {
                displayName: json.display_name,
                building: json.address?.amenity || json.address?.building || json.name || 'Current Campus Location',
                road: json.address?.road || 'Campus Way',
                city: json.address?.city || 'Austin',
                state: json.address?.state || 'Texas',
                postcode: json.address?.postcode || '',
                country: json.address?.country || 'United States',
                lat: parseFloat(json.lat || latitude),
                lng: parseFloat(json.lon || longitude),
                isGpsDetected: true
              };
            }
          }

          if (resolvedLocation) {
            setCurrentLocation(resolvedLocation);
            setCheckoutData(prev => ({
              ...prev,
              pickupLocation: resolvedLocation.building + ' (' + resolvedLocation.road + ')',
              lat: resolvedLocation.lat,
              lng: resolvedLocation.lng
            }));
            showToast(
              `Exact location detected: ${resolvedLocation.building} (${resolvedLocation.lat.toFixed(4)}° N, ${resolvedLocation.lng.toFixed(4)}° W)`
            );
          }
        } catch (err) {
          showToast(`Geocoding error: ${err.message}`, 'error');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        showToast(`GPS Location access denied or timed out (${error.message})`, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchGeocode = async (queryText) => {
    setGeocodeQuery(queryText);
    if (!queryText || queryText.trim().length < 3) {
      setGeocodeSuggestions([]);
      return;
    }

    setIsSearchingGeocode(true);
    try {
      let results = [];
      try {
        const res = await axios.get(`/api/geocode/search?q=${encodeURIComponent(queryText)}`);
        if (res.data?.success && res.data.results) {
          results = res.data.results;
        }
      } catch (e) {
        const fallbackRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryText)}&format=json&limit=5&addressdetails=1`
        );
        const json = await fallbackRes.json();
        if (Array.isArray(json)) {
          results = json.map(r => ({
            displayName: r.display_name,
            name: r.name || r.display_name.split(',')[0],
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
            city: r.address?.city || 'Austin'
          }));
        }
      }
      setGeocodeSuggestions(results);
    } catch (err) {
      console.warn('Geocoding search failed', err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const selectGeocodedLocation = (item) => {
    const loc = {
      displayName: item.displayName,
      building: item.name || item.displayName.split(',')[0],
      road: item.displayName.split(',')[1] || 'Campus Area',
      city: item.city || 'Austin',
      state: 'Texas',
      postcode: item.postcode || '',
      country: 'United States',
      lat: item.lat,
      lng: item.lng,
      isGpsDetected: false
    };
    setCurrentLocation(loc);
    setCheckoutData(prev => ({
      ...prev,
      pickupLocation: loc.building,
      lat: loc.lat,
      lng: loc.lng
    }));
    setGeocodeSuggestions([]);
    setGeocodeQuery('');
    setIsDeliveryModalOpen(false);
    showToast(`Hand-off point set to ${loc.building} (${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° W)`);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const shippingFee = 0;
  const finalTotal = cartSubtotal + shippingFee;

  const addToCart = (product, quantity = 1, chosenColor = null) => {
    const color = chosenColor || product.color || 'Standard';
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === color);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor: color }];
    });
    showToast(`Added ${quantity}x "${product.title}" to cart!`);
  };

  const updateQuantity = (id, color, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color)));
    showToast('Item removed from cart');
  };

  const toggleWishlist = async (productId, title) => {
    if (!currentUser) {
      showToast('Please sign in to save items to your wishlist', 'error');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }

    const exists = wishlist.includes(productId);
    setWishlist(prev => {
      if (exists) {
        showToast(`Removed "${title}" from wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved "${title}" to your wishlist!`);
        return [...prev, productId];
      }
    });

    const token = localStorage.getItem('campuscart_token') || authToken;
    if (token) {
      try {
        if (exists) {
          await axios.delete(`/api/wishlist/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`/api/wishlist/${productId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.warn('Backend wishlist update notice:', err.message);
      }
    }
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setSelectedColorIndex(0);
    setDetailQuantity(1);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication Handlers (Connected to Express MongoDB Backend)
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter both your campus email and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        email: authEmail.trim(),
        password: authPassword
      });

      if (res.data?.success) {
        const { user, token } = res.data;
        setCurrentUser(user);
        setAuthToken(token);
        localStorage.setItem('campuscart_user', JSON.stringify(user));
        localStorage.setItem('campuscart_token', token);

        setIsAuthModalOpen(false);
        setAuthEmail('');
        setAuthPassword('');
        showToast(`Welcome back, ${user.fullName || user.name || 'Student'}!`);

        // Mandatory post-login prompt: enter or confirm university!
        const userUniv = user.college || activeUniversity || 'Nirma University';
        setUniversityInput(userUniv);
        setIsUniversityModalOpen(true);

        // Fetch user data from DB
        fetchWishlist(token);
        fetchTransactions(token);
        fetchProducts(userUniv);
      } else {
        setAuthError(res.data?.error || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!authFullName.trim() || !authEmail.trim() || !authPassword) {
      setAuthError('Please fill in your name, college email, and password.');
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    try {
      const studentRoll = authStudentId.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await axios.post('/api/auth/register', {
        fullName: authFullName.trim(),
        email: authEmail.trim(),
        password: authPassword,
        studentId: studentRoll,
        department: authDepartment,
        college: authCollege
      });

      if (res.data?.success) {
        const { user, token } = res.data;
        setCurrentUser(user);
        setAuthToken(token);
        localStorage.setItem('campuscart_user', JSON.stringify(user));
        localStorage.setItem('campuscart_token', token);

        // Brand new user starts with 0 orders, 0 items in cart, 0 items in wishlist
        setCart([]);
        setWishlist([]);
        setTransactions([]);
        localStorage.setItem(`campuscart_cart_${user.email}`, JSON.stringify([]));
        localStorage.setItem(`campuscart_wishlist_${user.email}`, JSON.stringify([]));
        localStorage.setItem(`campuscart_transactions_${user.email}`, JSON.stringify([]));

        setIsAuthModalOpen(false);
        setAuthFullName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
        setAuthStudentId('');
        showToast(`Account registered successfully! Welcome to CampusCart, ${user.fullName || user.name}!`);
      } else {
        setAuthError(res.data?.error || 'Registration failed.');
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    setCart([]);
    setWishlist([]);
    setTransactions([]);
    localStorage.removeItem('campuscart_user');
    localStorage.removeItem('campuscart_token');
    setIsAuthModalOpen(false);
    showToast('Signed out of CampusCart account');
  };

  const handleOpenSellModal = () => {
    if (!currentUser) {
      showToast('You must log in to add products to the marketplace', 'error');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsSellModalOpen(true);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    // Critical Requirement: without login you cannot add products
    if (!currentUser) {
      showToast('Authentication required: Please log in before adding products', 'error');
      setIsSellModalOpen(false);
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!newListing.title || !newListing.price) {
      showToast('Please fill in title and price', 'error');
      return;
    }

    const priceNum = parseFloat(newListing.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid positive price', 'error');
      return;
    }

    const itemDescription = newListing.description?.trim() || `${newListing.condition} condition student exchange item on campus`;

    const created = {
      id: `cc-${Date.now()}`,
      title: newListing.title.trim(),
      price: priceNum,
      rating: 5,
      reviewsCount: 1,
      description: itemDescription,
      longDescription: itemDescription,
      category: newListing.category,
      type: newListing.category,
      condition: newListing.condition,
      college: newListing.college || activeUniversity || currentUser.college || 'National Institute of Technology',
      pickupLocation: newListing.pickupLocation || currentLocation.building,
      coordinates: {
        lat: newListing.lat || currentLocation.lat,
        lng: newListing.lng || currentLocation.lng
      },
      seller: {
        name: currentUser.fullName || currentUser.name || 'Verified Student',
        role: currentUser.role || 'student',
        studentId: currentUser.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        department: currentUser.department || 'Computer Science & Engineering',
        year: currentUser.academicYear || '3rd Year',
        email: currentUser.email,
        verified: true
      },
      stock: 1,
      color: 'Default',
      colorHex: '#334155',
      image: newListing.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      status: 'Available',
      offer: 'Student Listing',
      featured: true
    };

    // Store in MongoDB via Express API if authToken is available
    const token = localStorage.getItem('campuscart_token') || authToken;
    if (token) {
      try {
        const res = await axios.post(
          '/api/products',
          {
            title: created.title,
            description: created.description,
            category: created.category,
            price: created.price,
            condition: created.condition,
            image: created.image,
            college: created.college,
            location: {
              address: created.pickupLocation,
              coordinates: created.coordinates
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.success && res.data.product) {
          created.id = res.data.product._id || res.data.product.id || created.id;
          created._id = res.data.product._id;
        }
      } catch (backendErr) {
        console.warn('Backend product listing notification:', backendErr.message);
      }
    }

    setProducts(prev => [created, ...prev]);
    setIsSellModalOpen(false);
    fetchProducts(created.college);
    setNewListing({
      title: '',
      category: 'Books & Notes',
      price: '',
      condition: 'Like New',
      college: activeUniversity || currentUser.college || 'Engineering Campus',
      pickupLocation: currentLocation.building,
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      description: '',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    });
    showToast(`"${created.title}" successfully listed!`);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setReports(prev => prev.filter(r => r.id !== productId));
    showToast('Listing removed by Campus Administrator', 'info');
  };

  const handleUpdateProductStatus = (productId, newStatus) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p))
    );
    showToast(`Status updated to ${newStatus}`);
  };

  const handleUpdateTransactionStatus = (txnId, newStatus) => {
    setTransactions(prev =>
      prev.map(t => (t.id === txnId ? { ...t, status: newStatus } : t))
    );
    showToast(`Order #${txnId} marked as ${newStatus}`);
  };

  const handleCancelTransaction = (txnId) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId));
    showToast(`Order #${txnId} removed from tracking`, 'info');
  };

  // Admin Price Adjustment Handler (Saves directly to MongoDB)
  const handleAdminUpdatePrice = async (productId, newPrice) => {
    if (currentUser?.role !== 'admin') {
      showToast('Admin privileges required to adjust prices.', 'error');
      return;
    }

    const numPrice = Number(newPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      showToast('Please enter a valid non-negative price', 'error');
      return;
    }

    setAdminPriceUpdatingId(productId);
    const prod = products.find(p => p.id === productId);

    // Update in state & localStorage immediately
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: numPrice } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => ({ ...prev, price: numPrice }));
    }

    try {
      await axios.patch(
        `/api/products/${productId}/price`,
        { price: numPrice, title: prod?.title },
        { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} }
      );
      showToast(`Price for "${prod?.title || 'item'}" updated to ${formatINR(numPrice)} in MongoDB database!`, 'success');
      setIsAdminPriceModalOpen(false);
    } catch (err) {
      console.warn('Backend price update notification:', err.message);
      showToast(`Price updated to ${formatINR(numPrice)} in catalog!`, 'info');
      setIsAdminPriceModalOpen(false);
    } finally {
      setAdminPriceUpdatingId(null);
    }
  };

  const handleOpenPriceModal = (product) => {
    if (currentUser?.role !== 'admin') {
      showToast('Admin privileges required to edit item prices.', 'error');
      return;
    }
    setAdminPriceModalProduct(product);
    setAdminPriceModalInput(product.price.toString());
    setIsAdminPriceModalOpen(true);
  };

  // Dynamic Real-Time Category Count Calculator (Actual number of items)
  const getCategoryCount = (catName) => {
    return products.filter(item => {
      const pCat = (item.category || '').toLowerCase();
      const pType = (item.type || '').toLowerCase();
      const pTitle = (item.title || '').toLowerCase();
      const target = (catName || '').toLowerCase();

      if (target.includes('electr') || target.includes('headphone') || target.includes('audio')) {
        return pCat.includes('electr') || pType.includes('headphone') || pType.includes('ear') || pTitle.includes('headphone') || pTitle.includes('airpods') || pTitle.includes('earbuds') || pTitle.includes('audio');
      }
      if (target.includes('book') || target.includes('note') || target.includes('textbook')) {
        return pCat.includes('book') || pType.includes('book') || pTitle.includes('notes') || pTitle.includes('book') || pTitle.includes('mathematics') || pTitle.includes('chemistry') || pTitle.includes('physics');
      }
      if (target.includes('calc')) {
        return pCat.includes('calc') || pType.includes('calc') || pTitle.includes('calculator') || pTitle.includes('ti-84') || pTitle.includes('casio');
      }
      if (target.includes('bike') || target.includes('bicycle') || target.includes('mobil')) {
        return pCat.includes('bike') || pCat.includes('bicycle') || pType.includes('bicycle') || pTitle.includes('bicycle') || pTitle.includes('bike');
      }
      if (target.includes('lab') || target.includes('coat')) {
        return pCat.includes('lab') || pType.includes('lab') || pTitle.includes('lab') || pTitle.includes('caliper') || pTitle.includes('multimeter') || pTitle.includes('coat');
      }
      if (target.includes('furnit') || target.includes('chair') || target.includes('desk') || target.includes('table')) {
        return pCat.includes('furnit') || pType.includes('furnit') || pTitle.includes('table') || pTitle.includes('desk') || pTitle.includes('chair');
      }
      return pCat === target || pType === target || pCat.includes(target) || target.includes(pCat);
    }).length;
  };

  // Safe Category Selection: switches category, clears conflicting filters, and scrolls smoothly to catalog
  const handleSelectCategory = (catName) => {
    let canonical = catName;
    const lower = (catName || '').toLowerCase();
    if (lower.includes('book') || lower.includes('textbook') || lower.includes('note')) {
      canonical = 'Books & Notes';
    } else if (lower.includes('calc')) {
      canonical = 'Calculators';
    } else if (lower.includes('headphone') || lower.includes('ear') || lower.includes('audio') || lower.includes('electr')) {
      canonical = 'Electronics';
    } else if (lower.includes('bike') || lower.includes('bicycle') || lower.includes('mobil')) {
      canonical = 'Bicycles';
    } else if (lower.includes('lab') || lower.includes('coat')) {
      canonical = 'Lab Equipment';
    } else if (lower.includes('furnit') || lower.includes('chair') || lower.includes('desk') || lower.includes('table')) {
      canonical = 'Furniture';
    } else if (catName === 'All') {
      canonical = 'All';
    }

    setSelectedCategory(canonical);
    setSearchQuery('');
    setFilterCondition('All');
    setFilterPrice('All');
    setFilterCollege('All');
    setFilterStatus('All');
    setFilterOffer('All');
    setCurrentView('home');
    showToast(canonical === 'All' ? 'Showing all campus listings' : `Showing ${canonical} listings`);
    setTimeout(() => {
      const el = document.getElementById('campus-catalog') || document.getElementById('campus-items-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // Filtered Campus Listings Catalog (₹ Price Range & Robust Category Matching)
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCollege = item.college?.toLowerCase().includes(q);
        const matchesLocation = item.pickupLocation?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCollege && !matchesLocation) return false;
      }
      if (selectedCategory !== 'All') {
        const pCat = (item.category || '').toLowerCase();
        const pType = (item.type || '').toLowerCase();
        const pTitle = (item.title || '').toLowerCase();
        const target = selectedCategory.toLowerCase();

        let matchesCat = false;
        if (target.includes('electr') || target.includes('headphone') || target.includes('audio')) {
          matchesCat = pCat.includes('electr') || pType.includes('headphone') || pType.includes('ear') || pTitle.includes('headphone') || pTitle.includes('airpods') || pTitle.includes('earbuds') || pTitle.includes('audio');
        } else if (target.includes('book') || target.includes('note') || target.includes('textbook')) {
          matchesCat = pCat.includes('book') || pType.includes('book') || pTitle.includes('notes') || pTitle.includes('book') || pTitle.includes('mathematics') || pTitle.includes('chemistry') || pTitle.includes('physics');
        } else if (target.includes('calc')) {
          matchesCat = pCat.includes('calc') || pType.includes('calc') || pTitle.includes('calculator') || pTitle.includes('ti-84') || pTitle.includes('casio');
        } else if (target.includes('bike') || target.includes('bicycle') || target.includes('mobil')) {
          matchesCat = pCat.includes('bike') || pCat.includes('bicycle') || pType.includes('bicycle') || pTitle.includes('bicycle') || pTitle.includes('bike');
        } else if (target.includes('lab') || target.includes('coat')) {
          matchesCat = pCat.includes('lab') || pType.includes('lab') || pTitle.includes('lab') || pTitle.includes('caliper') || pTitle.includes('multimeter') || pTitle.includes('coat');
        } else if (target.includes('furnit') || target.includes('chair') || target.includes('desk') || target.includes('table')) {
          matchesCat = pCat.includes('furnit') || pType.includes('furnit') || pTitle.includes('table') || pTitle.includes('desk') || pTitle.includes('chair');
        } else {
          matchesCat = pCat.includes(target) || target.includes(pCat) || pType.includes(target);
        }

        if (!matchesCat) return false;
      }
      if (filterCondition !== 'All' && item.condition !== filterCondition) return false;
      // Price Filter in Rupees
      if (filterPrice === 'Under ₹1,000' && item.price >= 1000) return false;
      if (filterPrice === '₹1,000 - ₹3,000' && (item.price < 1000 || item.price > 3000)) return false;
      if (filterPrice === '₹3,000 - ₹10,000' && (item.price < 3000 || item.price > 10000)) return false;
      if (filterPrice === 'Over ₹10,000' && item.price <= 10000) return false;
      if (filterCollege !== 'All' && item.college !== filterCollege) return false;
      if (filterStatus !== 'All' && item.status !== filterStatus) return false;
      if (filterOffer === '50% Off' && item.offer !== '50% Off') return false;
      if (filterOffer === 'Special Deal' && item.offer !== 'Special Deal') return false;

      // Active University Scoping
      if (activeUniversity) {
        const normActive = activeUniversity.toLowerCase().trim();
        const pCollege = (item.college || '').toLowerCase().trim();
        if (pCollege && !pCollege.includes(normActive) && !normActive.includes(pCollege)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Rating') return b.rating - a.rating;
      if (sortBy === 'Newest') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, filterCondition, filterPrice, filterCollege, filterStatus, filterOffer, sortBy, activeUniversity]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFilterCondition('All');
    setFilterPrice('All');
    setFilterCollege('All');
    setFilterStatus('All');
    setFilterOffer('All');
    setSortBy('Featured');
    showToast('Filters reset to default view');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa] text-slate-800 w-full max-w-full overflow-x-hidden">
      {/* 2. MAIN NAVBAR - SOLID OPAQUE (Minimalist Clean White & Blue) */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Campus Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-blue-600 transition-colors">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap">
                  Campus<span className="text-blue-600">Cart</span>
                </span>
                <span className="hidden sm:block text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-1 whitespace-nowrap">
                  Student Exchange
                </span>
              </div>
            </button>

            {/* University Campus Selector Badge */}
            <button
              type="button"
              onClick={() => {
                setUniversityInput(activeUniversity);
                setIsUniversityModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title={`Active Campus: ${activeUniversity} (Click to change)`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[90px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[180px] text-[11px] sm:text-xs">
                {activeUniversity}
              </span>
              <span className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
                Change
              </span>
            </button>
          </div>

          {/* Fluid Center Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg min-w-[120px] mx-1 sm:mx-3 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search campus items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'home') setCurrentView('home');
                }}
                className="w-full bg-[#f8fafc] hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-1.5 sm:py-2 focus:outline-none focus:border-blue-600 border border-slate-200 transition-colors truncate"
              />
              <button
                aria-label="Search"
                onClick={() => {
                  const el = document.getElementById('campus-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-2 sm:right-2.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0 flex-nowrap">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="hidden md:inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={handleOpenSellModal}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline whitespace-nowrap">Sell An Item</span>
              <span className="xs:hidden whitespace-nowrap">Sell</span>
            </button>

            {/* Orders Button */}
            <button
              onClick={() => {
                setAccountTab('transactions');
                setCurrentView('my-listings');
              }}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'my-listings' && accountTab === 'transactions'
                  ? 'text-blue-600 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
              title="Track Orders & Campus Meetups"
            >
              <Receipt className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden sm:inline">Orders</span>
              {transactions.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                  {transactions.length}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              onClick={() => {
                if (!currentUser) setAuthTab('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-50"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                {currentUser ? (currentUser.fullName || currentUser.name || 'P')[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden md:inline whitespace-nowrap">
                {currentUser ? (currentUser.fullName || currentUser.name || 'Account').split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors relative cursor-pointer whitespace-nowrap shrink-0 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-50"
            >
              <div className="relative shrink-0">
                <ShoppingCart className="w-5 h-5 text-slate-800" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline whitespace-nowrap">Cart</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MAIN ROUTER VIEWS */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* VIEW 1: HOME MARKETPLACE */}
        {currentView === 'home' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-8 py-4 sm:py-6 space-y-8 sm:space-y-12 w-full">
            {/* HERO PROMO BANNER (Minimalist Obsidian / Slate / Royal Blue) */}
            <section className="bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#1e293b] text-white rounded-2xl p-5 sm:p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-slate-800 shadow-sm w-full">
              <div className="w-full md:max-w-xl z-10 space-y-3 sm:space-y-4 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-300 border border-blue-400/20 max-w-full truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" /> <span className="truncate">Verified Student Network • Campus Marketplace</span>
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Direct Campus Exchange For College Essentials
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
                  Buy, sell, and hand off used textbooks, calculators, bicycles, lab coats, and electronics directly with fellow students across dorms and academic departments.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('campus-catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 sm:px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Browse Campus Items</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleOpenSellModal}
                    className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Sell On Campus
                  </button>
                  <button
                    onClick={() => setIsCalculatorModalOpen(true)}
                    className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-blue-400" />
                    <span>Fair-Price Tool</span>
                  </button>
                </div>
              </div>

              <div className="relative w-full md:w-5/12 flex items-center justify-center">
                <div className="w-full bg-[#111827]/90 backdrop-blur-sm border border-slate-700/70 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xl">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5 sm:pb-3">
                    <span className="font-semibold text-slate-300">Featured Campus Listing</span>
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                      50% Student Discount
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white p-2 shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                        alt="Campus Headphones"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm truncate">Apple AirPods Max</h3>
                      <p className="text-[11px] text-slate-400 truncate">Like New • Science Quad Study Desk</p>
                      <div className="text-white font-black text-base pt-0.5">
                        ₹2,490 <span className="text-xs font-normal text-slate-400 line-through">₹4,990</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[170px] sm:max-w-none">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" /> <span className="truncate">Central Library 2nd Fl</span>
                    </span>
                    <button
                      onClick={() => {
                        const airpods = products.find(h => h.id === 'cc-2') || products[0];
                        handleOpenProduct(airpods);
                      }}
                      className="font-semibold text-blue-300 hover:text-white underline cursor-pointer shrink-0 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FILTER & SORT BAR */}
            <section id="campus-catalog" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Category Filter */}
                  <div className="relative group">
                    <select
                      aria-label="Filter by Category"
                      value={selectedCategory}
                      onChange={(e) => handleSelectCategory(e.target.value)}
                      className={`appearance-none font-medium px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border focus:outline-none focus:border-blue-600 transition-colors ${
                        selectedCategory !== 'All' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold hover:bg-blue-100' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="All" className="bg-white text-slate-900 py-1">All Categories</option>
                      <option value="Electronics" className="bg-white text-slate-900 py-1">Headphones & Electronics</option>
                      <option value="Books & Notes" className="bg-white text-slate-900 py-1">Textbooks & Notes</option>
                      <option value="Calculators" className="bg-white text-slate-900 py-1">Calculators</option>
                      <option value="Lab Equipment" className="bg-white text-slate-900 py-1">Lab Coats & Equipment</option>
                      <option value="Bicycles" className="bg-white text-slate-900 py-1">Bicycles & Mobility</option>
                      <option value="Furniture" className="bg-white text-slate-900 py-1">Furniture</option>
                      <option value="Other Essentials" className="bg-white text-slate-900 py-1">Other Essentials</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>

                  {/* Price Filter */}
                  <div className="relative group">
                    <select
                      aria-label="Filter by Price"
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(e.target.value)}
                      className={`appearance-none font-medium px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border focus:outline-none focus:border-blue-600 transition-colors ${
                        filterPrice !== 'All' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold hover:bg-blue-100' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="All" className="bg-white text-slate-900 py-1">Price Range</option>
                      <option value="Under ₹1,000" className="bg-white text-slate-900 py-1">Under ₹1,000</option>
                      <option value="₹1,000 - ₹3,000" className="bg-white text-slate-900 py-1">₹1,000 - ₹3,000</option>
                      <option value="₹3,000 - ₹10,000" className="bg-white text-slate-900 py-1">₹3,000 - ₹10,000</option>
                      <option value="Over ₹10,000" className="bg-white text-slate-900 py-1">Over ₹10,000</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>

                  {/* Condition Filter */}
                  <div className="relative group">
                    <select
                      aria-label="Filter by Item Condition"
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className={`appearance-none font-medium px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border focus:outline-none focus:border-blue-600 transition-colors ${
                        filterCondition !== 'All' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold hover:bg-blue-100' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="All" className="bg-white text-slate-900 py-1">Item Condition</option>
                      <option value="New" className="bg-white text-slate-900 py-1">Brand New</option>
                      <option value="Like New" className="bg-white text-slate-900 py-1">Like New</option>
                      <option value="Good" className="bg-white text-slate-900 py-1">Good Condition</option>
                      <option value="Fair" className="bg-white text-slate-900 py-1">Fair / Usable</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>

                  {/* Campus Location Filter */}
                  <div className="relative group">
                    <select
                      aria-label="Filter by Campus Location"
                      value={filterCollege}
                      onChange={(e) => setFilterCollege(e.target.value)}
                      className={`appearance-none font-medium px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border focus:outline-none focus:border-blue-600 transition-colors ${
                        filterCollege !== 'All' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold hover:bg-blue-100' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="All" className="bg-white text-slate-900 py-1">Campus Hub</option>
                      <option value="Engineering Campus" className="bg-white text-slate-900 py-1">Engineering Campus</option>
                      <option value="Science Quad" className="bg-white text-slate-900 py-1">Science Quad</option>
                      <option value="Business School" className="bg-white text-slate-900 py-1">Business School</option>
                      <option value="North Campus" className="bg-white text-slate-900 py-1">North Campus</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative group">
                    <select
                      aria-label="Filter by Listing Status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`appearance-none font-medium px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border focus:outline-none focus:border-blue-600 transition-colors ${
                        filterStatus !== 'All' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold hover:bg-blue-100' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="All" className="bg-white text-slate-900 py-1">Listing Status</option>
                      <option value="Available" className="bg-white text-slate-900 py-1">Available Now</option>
                      <option value="Reserved" className="bg-white text-slate-900 py-1">Reserved</option>
                      <option value="Sold" className="bg-white text-slate-900 py-1">Sold Out</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-1.5 rounded-lg cursor-pointer border border-slate-200 transition-colors shadow-2xs"
                  >
                    <span>Reset</span>
                    <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Right: Sort By */}
                <div className="relative">
                  <select
                    aria-label="Sort products"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border border-slate-200 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                  >
                    <option value="Featured">Sort: Featured</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Rating">Top Student Rating</option>
                    <option value="Newest">Recently Listed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>
              </div>
            </section>

            {/* 4. SECTION: Campus Listings Catalog */}
            <section id="campus-items-section" className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedCategory === 'All'
                      ? 'Available Campus Items'
                      : `${selectedCategory} on Campus`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified student listings across campus dorms
                  </p>
                </div>
                <span className="text-xs text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md whitespace-nowrap">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {isCatalogLoading ? (
                <CatalogGridSkeleton count={8} />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
                  <Package className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No campus items match your filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Be the first student to list an item in this category or reset your filter criteria.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={resetAllFilters}
                      className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Reset All Filters
                    </button>
                    <button
                      onClick={handleOpenSellModal}
                      className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      Post a Listing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className="product-card group bg-white rounded-xl border border-slate-200 flex flex-col justify-between overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-200"
                      >
                        {/* Image Container */}
                        <div className="relative product-image-container p-6 aspect-square flex items-center justify-center overflow-hidden cursor-pointer bg-[#f8fafc]">
                          <button
                            aria-label={`Toggle wishlist for ${product.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id, product.title);
                            }}
                            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer hover:bg-white transition-colors"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            />
                          </button>

                          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                            {product.offer && (
                              <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                {product.offer}
                              </span>
                            )}
                            {product.condition && (
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                                {product.condition}
                              </span>
                            )}
                          </div>

                          <img
                            src={product.image}
                            alt={product.title}
                            onClick={() => handleOpenProduct(product)}
                            className="w-full h-full object-contain select-none group-hover:scale-102 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>

                        {/* Details */}
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h3
                                onClick={() => handleOpenProduct(product)}
                                className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
                              >
                                {product.title}
                              </h3>
                              <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                                {formatINR(product.price)}
                              </span>
                            </div>

                            {/* Admin Quick Price Adjuster Trigger */}
                            {currentUser?.role === 'admin' && (
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                                  Admin
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPriceModal(product);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                  title="Adjust price directly in MongoDB"
                                >
                                  <Edit3 className="w-3 h-3 text-blue-600" />
                                  <span>Adjust Price</span>
                                </button>
                              </div>
                            )}

                            <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                              {product.description}
                            </p>

                            {/* Rating Stars */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="flex items-center text-blue-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">
                                ({product.reviewsCount || 121})
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons: Add to Cart & Buy Now */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-full py-2 px-1 rounded-lg font-semibold text-xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer shadow-2xs"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleBuyNow(product)}
                              className="w-full py-2 px-1 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 5. POPULAR CATEGORIES (Balanced 6-Column Shelf - Direct Category Trigger) */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Campus Departments & Categories
                  </h2>
                  <p className="text-xs text-slate-500">Explore gear by college department</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {POPULAR_CATEGORIES.map((cat) => {
                  const actualCount = getCategoryCount(cat.name);
                  return (
                    <div
                      key={cat.name}
                      onClick={() => handleSelectCategory(cat.name)}
                      className="group bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col items-center text-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                        <img
                          src={cat.img}
                          alt={cat.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-1">
                          {cat.displayName || cat.name}
                        </h4>
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                          {actualCount} {actualCount === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AUTHENTIC VERIFIED CAMPUS ACTIVITY FEED (Zero Fake Testimonials) */}
            <CampusExchangeLedger />

            {/* 6. SIMILAR ITEMS YOU MIGHT LIKE */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended Student Items
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {SIMILAR_ITEMS.map((item) => (
                  <div key={item.id} className="product-card group bg-white rounded-xl border border-slate-200 flex flex-col justify-between overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-200">
                    <div className="relative product-image-container p-6 aspect-square flex items-center justify-center overflow-hidden cursor-pointer bg-[#f8fafc]">
                      <button
                        aria-label={`Toggle wishlist for ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id, item.title);
                        }}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer hover:bg-white"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.title}
                        onClick={() => handleOpenProduct(item)}
                        className="w-full h-full object-contain select-none group-hover:scale-102 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3
                            onClick={() => handleOpenProduct(item)}
                            className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {item.title}
                          </h3>
                          <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                            {formatINR(item.price)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex items-center text-blue-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({item.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="w-full py-2 px-1 rounded-lg font-semibold text-xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer shadow-2xs"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="w-full py-2 px-1 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. RECENTLY VIEWED */}
            <section className="space-y-4 pt-2 pb-8">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recently Viewed on Campus
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {RECENTLY_VIEWED.map((item) => (
                  <div key={item.id} className="product-card group bg-white rounded-xl border border-slate-200 flex flex-col justify-between overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-200">
                    <div className="relative product-image-container p-6 aspect-square flex items-center justify-center overflow-hidden cursor-pointer bg-[#f8fafc]">
                      <button
                        aria-label={`Toggle wishlist for ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id, item.title);
                        }}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer hover:bg-white"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.title}
                        onClick={() => handleOpenProduct(item)}
                        className="w-full h-full object-contain select-none group-hover:scale-102 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3
                            onClick={() => handleOpenProduct(item)}
                            className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {item.title}
                          </h3>
                          <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                            {formatINR(item.price)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex items-center text-blue-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({item.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="w-full py-2 px-1 rounded-lg font-semibold text-xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer shadow-2xs"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="w-full py-2 px-1 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT DETAIL */}
        {currentView === 'product-detail' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fade-in">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium flex-wrap">
              <button
                onClick={() => setCurrentView('home')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Campus Marketplace
              </button>
              <span>/</span>
              <button
                onClick={() => {
                  setSelectedCategory(selectedProduct.category);
                  setCurrentView('home');
                }}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {selectedProduct.category}
              </button>
              <span>/</span>
              <span className="text-slate-400">Shop items by category</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold">{selectedProduct.title.toLowerCase().replace(/\s+/g, '-')}</span>
            </nav>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Marketplace</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Gallery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 aspect-square flex items-center justify-center relative">
                  <button
                    aria-label={`Toggle wishlist for ${selectedProduct.title}`}
                    onClick={() => toggleWishlist(selectedProduct.id, selectedProduct.title)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>

                  <img
                    src={
                      selectedProduct.colorVariants && selectedProduct.colorVariants[selectedColorIndex]
                        ? selectedProduct.colorVariants[selectedColorIndex].img
                        : selectedProduct.image
                    }
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {(selectedProduct.colorVariants || [
                    { name: 'Default', hex: '#333', img: selectedProduct.image },
                    { name: 'Angle 2', hex: '#666', img: selectedProduct.image },
                    { name: 'Angle 3', hex: '#999', img: selectedProduct.image },
                    { name: 'Angle 4', hex: '#ccc', img: selectedProduct.image }
                  ]).slice(0, 4).map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`bg-white rounded-lg p-2 aspect-square flex items-center justify-center cursor-pointer border transition-all ${
                        selectedColorIndex === idx ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={variant.img} alt={variant.name} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Information & Pricing */}
              <div className="lg:col-span-6 space-y-5 bg-white rounded-xl border border-slate-200 p-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-sm border border-blue-200">
                      {selectedProduct.condition || 'Like New'} Condition
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-sm">
                      {selectedProduct.college || 'Engineering Campus'}
                    </span>
                    {selectedProduct.coordinates && (
                      <span className="coordinate-badge text-[11px] px-2 py-0.5 rounded-sm font-mono flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-blue-600" />
                        <span>Lat {selectedProduct.coordinates.lat.toFixed(4)}°, Lng {selectedProduct.coordinates.lng.toFixed(4)}°</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {selectedProduct.title}
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    {selectedProduct.longDescription || selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center text-blue-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      ({selectedProduct.reviewsCount || 121})
                    </span>
                  </div>
                </div>

                {/* Seller Verified Profile Card */}
                {selectedProduct.seller && (
                  <div className="bg-[#f8f9fa] border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {selectedProduct.seller.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-slate-900">{selectedProduct.seller.name}</h4>
                          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.2 rounded-sm">
                            Verified Student
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {selectedProduct.seller.department} • {selectedProduct.seller.year}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Contact Seller</span>
                    </button>
                  </div>
                )}

                <hr className="border-slate-100" />

                {/* Pricing Display */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {formatINR(selectedProduct.price)}
                    </span>
                    <span className="text-slate-600 text-sm font-medium">
                      or {formatINR(selectedProduct.monthlyPrice || Math.round(selectedProduct.price / 4))}/month
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct student handshake settlement via Cash or instant peer-to-peer digital transfer on meetup
                  </p>

                  {/* Admin Direct Price Edit Trigger on Detail Page */}
                  {currentUser?.role === 'admin' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(selectedProduct)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Admin: Adjust Price in Database</span>
                      </button>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100" />

                {/* Choose a Color */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Color Variant</span>
                    <span className="text-slate-500 font-medium">
                      {selectedProduct.colorVariants?.[selectedColorIndex]?.name || selectedProduct.color || 'Standard'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {(selectedProduct.colorVariants || [
                      { name: 'Red', hex: '#e17076' },
                      { name: 'Dark Gray', hex: '#374151' },
                      { name: 'Mint Green', hex: '#bbf7d0' },
                      { name: 'Silver White', hex: '#e2e8f0' },
                      { name: 'Sky Blue', hex: '#38bdf8' }
                    ]).map((c, i) => (
                      <button
                        key={i}
                        aria-label={`Select color ${c.name}`}
                        onClick={() => setSelectedColorIndex(i)}
                        className={`w-7 h-7 rounded-md border transition-all p-0.5 relative flex items-center justify-center cursor-pointer ${
                          selectedColorIndex === i ? 'ring-2 ring-blue-600 border-white' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColorIndex === i && (
                          <Check className={`w-3 h-3 ${['#f8fafc', '#e2e8f0', '#bbf7d0'].includes(c.hex) ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Stock Left */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center bg-[#f8f9fa] rounded-md border border-slate-300">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setDetailQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-slate-800">
                      {detailQuantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setDetailQuantity(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px]">
                    <p className="font-semibold text-slate-700">
                      Only {selectedProduct.stock || 1} available
                    </p>
                    <p className="text-slate-400">Available for direct campus pickup</p>
                  </div>
                </div>

                {/* Action Buttons: Buy Now & Add to Cart */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const chosenColor = selectedProduct.colorVariants?.[selectedColorIndex]?.name || selectedProduct.color;
                      addToCart(selectedProduct, detailQuantity, chosenColor);
                      setCurrentView('checkout');
                    }}
                    className="w-full sm:flex-1 btn-primary-blue py-2.5 rounded-md font-bold text-xs text-center cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => {
                      const chosenColor = selectedProduct.colorVariants?.[selectedColorIndex]?.name || selectedProduct.color;
                      addToCart(selectedProduct, detailQuantity, chosenColor);
                    }}
                    className="w-full sm:flex-1 py-2.5 rounded-md font-bold text-xs text-center border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Free Delivery & Exact Geocoded Hand-Off Card */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-[#f8f9fa] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900">Campus In-Person Hand-Off</h4>
                        {selectedProduct.coordinates && (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${selectedProduct.coordinates.lat}&mlon=${selectedProduct.coordinates.lng}#map=17/${selectedProduct.coordinates.lat}/${selectedProduct.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            <span>Open Map</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Designated hub:{' '}
                        <span className="font-semibold text-slate-800">
                          {selectedProduct.pickupLocation || 'Central Library Desk'}
                        </span>
                      </p>
                      {selectedProduct.coordinates && (
                        <p className="text-[10px] font-mono text-slate-600">
                          Coordinates: {selectedProduct.coordinates.lat.toFixed(4)}° N, {selectedProduct.coordinates.lng.toFixed(4)}° W
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-[#f8f9fa] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-900">7-Day Campus Inspection Guarantee</h4>
                      <p className="text-[11px] text-slate-500">
                        Inspect during meetup! Honor code protection on all campus trades.{' '}
                        <button
                          onClick={() => setIsTermsModalOpen(true)}
                          className="font-bold text-slate-800 underline hover:text-blue-600 cursor-pointer"
                        >
                          View Policy
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CHECKOUT & DELIVERY / PAYMENT */}
        {currentView === 'checkout' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Shopping</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Delivery Information & Payment Details
              </h1>
            </div>

            {orderPlaced ? (
              <div className="text-center py-16 bg-blue-50/70 rounded-xl p-8 space-y-4 max-w-lg mx-auto border border-blue-200 animate-scale-up">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Campus Order Confirmed!</h2>
                <p className="text-sm text-slate-600">
                  Thank you, <span className="font-bold">{checkoutData.name}</span>! Your exchange request has been dispatched to the student seller.
                </p>
                <div className="bg-white rounded-2xl p-4 text-xs text-left space-y-2 border border-blue-100 shadow-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Campus Hand-Off Point:</span>
                    <span className="font-bold text-slate-800">{checkoutData.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Geocoded GPS Fix:</span>
                    <span className="font-mono text-slate-700">
                      {checkoutData.lat?.toFixed(4)}° N, {checkoutData.lng?.toFixed(4)}° W
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Student ID:</span>
                    <span className="font-mono font-bold text-blue-600">{checkoutData.studentId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Total Amount:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{formatINR(finalTotal)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCart([]);
                    setOrderPlaced(false);
                    setCurrentView('home');
                  }}
                  className="btn-primary-blue px-8 py-3 rounded-full text-xs font-bold cursor-pointer"
                >
                  Back to Marketplace
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto shadow-xs animate-fade-in">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Your Checkout Cart is Empty</h3>
                <p className="text-xs text-slate-500">
                  You have removed all items from your checkout list. Browse the campus catalog to find student essentials.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="btn-primary-blue px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  Return to Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  {/* Delivery Information Box */}
                  <div id="checkout-delivery-form" className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900">
                            Delivery Information
                          </h3>
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
                            * Mandatory Fields
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Uses GPS Geocoding for accurate campus meeting point</p>
                      </div>

                      <button
                        onClick={detectExactLocation}
                        disabled={isDetectingLocation}
                        className="btn-primary-blue px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {isDetectingLocation ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>Use Exact GPS Location</span>
                      </button>
                    </div>

                    {Object.keys(checkoutErrors).length > 0 && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Please complete all required fields marked with an asterisk (*) to place your campus order.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Student Full Name <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Parv Patel"
                          value={checkoutData.name}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, name: e.target.value });
                            if (checkoutErrors.name) setCheckoutErrors(prev => ({ ...prev, name: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.name
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.name && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Student Roll Number / ID <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 24BCE327"
                          value={checkoutData.studentId}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, studentId: e.target.value });
                            if (checkoutErrors.studentId) setCheckoutErrors(prev => ({ ...prev, studentId: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.studentId
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.studentId && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.studentId}</span>
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">
                          Campus Meetup Point / Geocoded Address <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Central Library 1st Floor / Campus Cafeteria Hub"
                          value={checkoutData.pickupLocation}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, pickupLocation: e.target.value });
                            if (checkoutErrors.pickupLocation) setCheckoutErrors(prev => ({ ...prev, pickupLocation: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.pickupLocation
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.pickupLocation && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.pickupLocation}</span>
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>
                            Coordinates:{' '}
                            <strong className="text-slate-700 font-mono">
                              {checkoutData.lat?.toFixed(4)}° N, {checkoutData.lng?.toFixed(4)}° W
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsDeliveryModalOpen(true)}
                            className="text-blue-600 font-bold underline cursor-pointer hover:text-blue-700"
                          >
                            Browse Geocoded Hubs
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          College / Campus Wing <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Engineering Block A / Hostel Wing 3"
                          value={checkoutData.college}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, college: e.target.value });
                            if (checkoutErrors.college) setCheckoutErrors(prev => ({ ...prev, college: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.college
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.college && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.college}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Mobile Phone <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={checkoutData.mobile}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, mobile: e.target.value });
                            if (checkoutErrors.mobile) setCheckoutErrors(prev => ({ ...prev, mobile: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.mobile
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.mobile && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.mobile}</span>
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">
                          University Email <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. student@college.edu"
                          value={checkoutData.email}
                          onChange={(e) => {
                            setCheckoutData({ ...checkoutData, email: e.target.value });
                            if (checkoutErrors.email) setCheckoutErrors(prev => ({ ...prev, email: '' }));
                          }}
                          className={`w-full bg-[#f8f9fa] border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium transition-all focus:outline-none ${
                            checkoutErrors.email
                              ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 focus:border-blue-600 focus:bg-white'
                          }`}
                        />
                        {checkoutErrors.email && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{checkoutErrors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Box */}
                  <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Payment Details
                    </h3>

                    <div className="space-y-2.5">
                      {[
                        { id: 'cash_on_meetup', label: 'Cash on Campus Meetup' },
                        { id: 'campuscart_card', label: 'CampusCart Student Wallet' },
                        { id: 'upi_pay', label: 'Digital Peer Transfer (Venmo / Zelle / PayPal)' },
                        { id: 'credit_or_debit', label: 'Credit or Debit Card', icons: true }
                      ].map(option => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            checkoutData.paymentMethod === option.id
                              ? 'border-blue-600 bg-blue-50/50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option.id}
                              checked={checkoutData.paymentMethod === option.id}
                              onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                              className="accent-blue-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-800">{option.label}</span>
                          </div>
                          {option.icons && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black bg-slate-700 text-white px-1.5 py-0.5 rounded">CARD</span>
                              <span className="text-[10px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded">MC</span>
                              <span className="text-[10px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">VISA</span>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5 bg-white rounded-xl p-6 sm:p-7 border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Order Summary
                    </h3>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}`}
                        className="flex items-center gap-3 bg-[#f8f9fa] hover:bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors group relative"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-contain bg-white p-1 shrink-0 border border-slate-100 shadow-2xs"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                          <p className="text-slate-500 text-[11px]">Condition: {item.condition || 'Good'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-600 font-semibold">Qty: {item.quantity}</span>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.selectedColor)}
                              className="text-[11px] text-rose-500 hover:text-rose-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title={`Remove ${item.title} from order`}
                            >
                              <Trash2 className="w-3 h-3 shrink-0" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {formatINR(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.selectedColor)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Remove ${item.title}`}
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900">{formatINR(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Campus Delivery</span>
                      <span className="font-bold text-blue-700">FREE HAND-OFF</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span>{formatINR(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    className="w-full btn-primary-blue py-3 rounded-md font-bold text-xs text-center cursor-pointer"
                  >
                    Confirm & Request Item
                  </button>

                  <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                    By placing this order, you agree to the{' '}
                    <button type="button" onClick={() => setIsTermsModalOpen(true)} className="underline text-blue-600 font-medium cursor-pointer">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="underline text-blue-600 font-medium cursor-pointer">Privacy Policy</button>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: MY LISTINGS & TRANSACTION TRACKING */}
        {currentView === 'my-listings' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 animate-fade-in">
            {/* Header and Tab Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  {accountTab === 'listings' ? 'My Campus Listings' : 'Campus Orders & Transaction Tracking'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {accountTab === 'listings'
                    ? 'Manage your active sale and exchange listings across campus dorms'
                    : 'Track your campus purchases, seller hand-off meetups, and transaction history'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Tab Switch Buttons */}
                <div className="inline-flex bg-[#f1f3f5] p-1 rounded-full border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setAccountTab('listings')}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      accountTab === 'listings'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>My Listings</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${accountTab === 'listings' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {currentUser ? products.filter(p => p.seller?.email && p.seller.email.toLowerCase() === currentUser.email.toLowerCase()).length : 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setAccountTab('transactions')}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      accountTab === 'transactions'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Track Orders</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${accountTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {transactions.filter(t => !t.buyerEmail || (currentUser && t.buyerEmail.toLowerCase() === currentUser.email.toLowerCase())).length}
                    </span>
                  </button>
                </div>

                {accountTab === 'listings' && (
                  <button
                    onClick={handleOpenSellModal}
                    className="btn-primary-blue px-4 py-2 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Listing</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: MY CAMPUS LISTINGS */}
            {accountTab === 'listings' && (
              <div className="space-y-4">
                {!currentUser ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4 max-w-lg mx-auto shadow-xs">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Student Sign In Required</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Without logging in, you cannot list or manage your products. Please sign in or register with your college email.
                    </p>
                    <button
                      onClick={() => {
                        setAuthTab('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="btn-primary-blue px-6 py-2.5 rounded-full text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  </div>
                ) : products.filter(p => p.seller?.email && p.seller.email.toLowerCase() === currentUser.email.toLowerCase()).length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-800 text-base">You Have No Active Listings</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Ready to sell textbooks, electronics, or college essentials? Click below to post your first listing.
                    </p>
                    <button
                      onClick={handleOpenSellModal}
                      className="btn-primary-blue px-5 py-2 rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create First Listing</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products
                      .filter(p => p.seller?.email && p.seller.email.toLowerCase() === currentUser.email.toLowerCase())
                      .map(product => (
                        <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <img src={product.image} alt={product.title} className="w-16 h-16 rounded-2xl object-contain bg-[#f5f6f8] p-2" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 truncate text-sm">{product.title}</h4>
                              <p className="text-xs text-slate-900 font-extrabold mt-0.5">{formatINR(product.price)}</p>
                              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                            <span className="text-slate-500 font-medium">Exchange Status:</span>
                            <select
                              value={product.status || 'Available'}
                              onChange={(e) => handleUpdateProductStatus(product.id, e.target.value)}
                              className="bg-[#f5f6f8] border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 text-slate-800 cursor-pointer"
                            >
                              <option value="Available">Available</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Sold">Sold</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleOpenProduct(product)}
                              className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TRANSACTION TRACKING & CAMPUS ORDERS */}
            {accountTab === 'transactions' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-5">
                    <span className="text-xs text-slate-500 font-medium">Total Tracked Orders</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length} Requests</p>
                  </div>
                  <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-5">
                    <span className="text-xs text-slate-500 font-medium">Total Value</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {formatPrice(transactions.reduce((sum, t) => sum + (Number(t.price) || 0), 0))}
                    </p>
                  </div>
                  <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-5">
                    <span className="text-xs text-slate-500 font-medium">Confirmed Campus Hand-Offs</span>
                    <p className="text-2xl font-black text-blue-700 mt-1">
                      {transactions.filter(t => t.status === 'Accepted' || t.status === 'Completed').length} Orders
                    </p>
                  </div>
                </div>

                {/* Transactions List */}
                {transactions.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-800 text-lg">No Campus Transactions Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Place an order or send a request for textbooks, calculators, or bikes to track campus hand-off meetups.
                    </p>
                    <button
                      onClick={() => setCurrentView('home')}
                      className="btn-primary-blue px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map(txn => {
                      const isPending = txn.status === 'Pending';
                      const isAccepted = txn.status === 'Accepted';
                      const isCompleted = txn.status === 'Completed';

                      return (
                        <div
                          key={txn.id}
                          className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                                #{txn.id}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{txn.date || 'Campus Exchange'}</span>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                                  isAccepted
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : isCompleted
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : isPending
                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                ● {txn.status || 'Pending'}
                              </span>

                              <select
                                value={txn.status || 'Pending'}
                                onChange={(e) => handleUpdateTransactionStatus(txn.id, e.target.value)}
                                className="text-xs font-bold bg-[#f5f6f8] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-black text-slate-900 text-base">{txn.itemTitle}</h3>
                              <p className="text-xs text-slate-500">
                                Seller / Contact: <span className="font-semibold text-slate-800">{txn.sellerName}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                                <span className="flex items-center gap-1 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  <span>{txn.pickupSpot || 'Campus Library / Student Center'}</span>
                                </span>
                                {txn.coordinates && (
                                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                    <Crosshair className="w-3 h-3 text-blue-600" />
                                    <span>
                                      {txn.coordinates.lat?.toFixed(4)}° N, {txn.coordinates.lng?.toFixed(4)}° W
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-left md:text-right shrink-0">
                              <span className="text-[11px] text-slate-400 block font-medium">Exchange Amount</span>
                              <span className="text-2xl font-black text-slate-900">
                                {formatPrice(txn.price)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              {txn.coordinates && (
                                <a
                                  href={`https://www.openstreetmap.org/?mlat=${txn.coordinates.lat}&mlon=${txn.coordinates.lng}#map=17/${txn.coordinates.lat}/${txn.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>View Meetup Pin on Map</span>
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedProduct({
                                    title: txn.itemTitle,
                                    price: txn.price,
                                    seller: { name: txn.sellerName, email: 'seller@campus.edu' }
                                  });
                                  setIsContactModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Message Seller</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              {txn.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateTransactionStatus(txn.id, 'Completed')}
                                  className="btn-primary-blue px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                                >
                                  Mark Received (Completed)
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelTransaction(txn.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove order from tracking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          currentUser?.role !== 'admin' ? (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Only authorized campus administrators can access this moderation panel and adjust catalog pricing. Please sign in with administrator credentials to proceed.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setCurrentView('home')}
                  className="btn-primary-blue px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  Return to Marketplace
                </button>
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Admin Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Campus Moderator</span>
                  <h1 className="text-2xl font-black text-slate-900">Administrator Dashboard</h1>
                </div>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Back to Marketplace
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Campus Students</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">542 Users</p>
                </div>
                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Active Listings</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{products.length} Items</p>
                </div>
                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Exchanges</span>
                  <p className="text-2xl font-black text-blue-700 mt-1">218 Orders</p>
                </div>
                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Trade Volume</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {formatINR(transactions.reduce((acc, t) => acc + (Number(t.price) || 0), 0) + 18450)}
                  </p>
                </div>
                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Pending Reports</span>
                  <p className="text-2xl font-black text-rose-600 mt-1">{reports.length}</p>
                </div>
              </div>

              {/* Moderate Listings */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Moderate Inappropriate Listings</h3>
                {reports.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No pending user reports. Everything is clean!</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map(rep => (
                      <div key={rep.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{rep.productTitle}</h4>
                          <p className="text-xs text-rose-700 font-medium mt-0.5">Reported for: {rep.reason}</p>
                          <span className="text-[11px] text-slate-400">By: {rep.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReports(prev => prev.filter(r => r.id !== rep.id));
                              showToast('Report dismissed as valid listing');
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => {
                              setReports(prev => prev.filter(r => r.id !== rep.id));
                              showToast('Inappropriate listing removed immediately', 'error');
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                          >
                            Delete Listing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DIRECT PRODUCT PRICE ADJUSTMENT IN MONGODB */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">Direct Product Price Adjustment (MongoDB)</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Admin Live DB Write
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Adjust the selling price for any campus item. Changes are saved directly to the database in real time.
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                    {products.length} Products in Catalog
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Current Price</th>
                        <th className="py-3 px-4">Adjust Price (₹)</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(prod => {
                        const draft = adminPriceDrafts[prod.id] !== undefined ? adminPriceDrafts[prod.id] : prod.price;
                        const isSaving = adminPriceUpdatingId === prod.id;
                        const hasChanged = Number(draft) !== prod.price;

                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.title}
                                  className="w-10 h-10 rounded-xl object-contain bg-slate-100 p-1 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">{prod.title}</p>
                                  <p className="text-[10px] text-slate-400">ID: {prod.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                {prod.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900 text-sm">
                              {formatINR(prod.price)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 max-w-[150px]">
                                <span className="text-slate-500 font-bold text-sm">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={draft}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAdminPriceDrafts(prev => ({ ...prev, [prod.id]: val }));
                                  }}
                                  className="w-24 bg-[#f8f9fa] border border-slate-300 focus:border-blue-600 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleAdminUpdatePrice(prod.id, draft)}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  hasChanged
                                    ? 'bg-slate-900 hover:bg-blue-600 text-white shadow-xs'
                                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {isSaving ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving DB...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save to Database</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Campus Transactions & Financial Ledger */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Campus Transaction Ledger</h3>
                    <p className="text-xs text-slate-500">Live record of student exchanges, hand-off coordinates, and amounts transacted</p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 self-start">
                    Active Campus Ledger
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Txn ID</th>
                        <th className="py-3 px-4">Item & Seller</th>
                        <th className="py-3 px-4">Amount (₹)</th>
                        <th className="py-3 px-4">Campus Hand-Off Spot</th>
                        <th className="py-3 px-4">GPS Coordinates</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map(txn => (
                        <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600">#{txn.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{txn.itemTitle}</p>
                            <p className="text-[11px] text-slate-400">Seller: {txn.sellerName}</p>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                            {formatINR(txn.price)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {txn.pickupSpot || 'Central Library Quad'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            {txn.coordinates ? `${txn.coordinates.lat?.toFixed(4)}° N, ${txn.coordinates.lng?.toFixed(4)}° W` : 'Default Quad'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[10px] ${
                              txn.status === 'Completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              txn.status === 'Accepted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              ● {txn.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* 4. SLIDE-OVER SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40  transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
            <div className="w-full max-w-md bg-white shadow-lg border border-slate-200 flex flex-col justify-between animate-slide-in-right">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-lg text-slate-900">Your Cart</h3>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartTotalItems} items
                  </span>
                </div>
                <button
                  aria-label="Close cart drawer"
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-base">Your cart is empty</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Explore our campus marketplace and add textbooks, headphones, or bicycles.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="btn-primary-blue px-6 py-2 rounded-full text-xs font-bold cursor-pointer"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedColor}`}
                      className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#f8f9fa] border border-slate-100 relative group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-contain bg-white p-2 shrink-0 shadow-2xs"
                      />

                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-bold text-slate-900 truncate text-sm">{item.title}</h4>
                        <p className="text-slate-400 text-xs">Option: {item.selectedColor}</p>
                        <p className="font-extrabold text-slate-900 mt-1 text-sm">
                          {formatINR(item.price * item.quantity)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center bg-white rounded-lg border border-slate-200">
                            <button
                              aria-label={`Decrease quantity of ${item.title}`}
                              onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              aria-label={`Increase quantity of ${item.title}`}
                              onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            aria-label={`Remove ${item.title} from cart`}
                            onClick={() => removeFromCart(item.id, item.selectedColor)}
                            className="text-slate-400 hover:text-rose-600 transition-colors ml-auto p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900">{formatINR(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Campus Delivery</span>
                      <span className="font-bold text-blue-700">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Amount</span>
                      <span>{formatINR(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutErrors({});
                      setCurrentView('checkout');
                    }}
                    className="w-full btn-primary-blue py-3.5 rounded-full font-bold text-sm text-center shadow-md cursor-pointer transition-transform active:scale-98"
                  >
                    Proceed to Campus Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. POST / SELL AN ITEM MODAL */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-8 max-w-lg w-full shadow-lg border border-slate-200 space-y-4 animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">List an Item on CampusCart</h3>
                <p className="text-xs text-slate-500">Sell or exchange your textbooks, electronics, and gear</p>
              </div>
              <button
                aria-label="Close sell modal"
                onClick={() => setIsSellModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!currentUser ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Student Sign In Required</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Without login you cannot add or list products. Please sign in or register with your college email to sell items on CampusCart.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSellModalOpen(false);
                      setAuthTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="btn-primary-blue px-6 py-2.5 rounded-full text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Create Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony WH-1000XM4 or Data Structures Notes"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category</label>
                    <select
                      value={newListing.category}
                      onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium"
                    >
                      <option value="Books & Notes">Books & Notes</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Calculators">Calculators</option>
                      <option value="Lab Equipment">Lab Equipment</option>
                      <option value="Bicycles">Bicycles</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Other Essentials">Other Essentials</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="1"
                      required
                      placeholder="e.g. 499"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Condition</label>
                    <select
                      value={newListing.condition}
                      onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium"
                    >
                      <option value="New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Campus Hub</label>
                    <select
                      value={newListing.college}
                      onChange={(e) => setNewListing({ ...newListing, college: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium"
                    >
                      <option value="Engineering Campus">Engineering Campus</option>
                      <option value="Science Quad">Science Quad</option>
                      <option value="Business School">Business School</option>
                      <option value="North Campus">North Campus</option>
                    </select>
                  </div>
                </div>

                {/* Geocoded Pickup Location */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Campus Hand-Off Point</label>
                    <button
                      type="button"
                      onClick={() => {
                        detectExactLocation();
                        setNewListing(prev => ({
                          ...prev,
                          pickupLocation: currentLocation.building,
                          lat: currentLocation.lat,
                          lng: currentLocation.lng
                        }));
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Crosshair className="w-3 h-3 text-blue-600" />
                      <span>Pin Exact GPS Coordinates</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Central Library 1st Floor Lobby"
                    value={newListing.pickupLocation}
                    onChange={(e) => setNewListing({ ...newListing, pickupLocation: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                    Fixed Coordinates: {newListing.lat.toFixed(4)}° N, {newListing.lng.toFixed(4)}° W
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Product Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newListing.image}
                    onChange={(e) => setNewListing({ ...newListing, image: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Description & Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Mention why you are selling, any highlights or inclusions..."
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary-blue py-3 rounded-full text-xs font-bold cursor-pointer shadow-md"
                >
                  Publish Listing
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. CONTACT SELLER MODAL */}
      {isContactModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-8 max-w-md w-full shadow-lg border border-slate-200 space-y-4 animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Message Seller: {selectedProduct.seller?.name}
                </h3>
              </div>
              <button
                aria-label="Close contact modal"
                onClick={() => {
                  setIsContactModalOpen(false);
                  setChatSent(false);
                }}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {chatSent ? (
              <div className="text-center py-8 space-y-3 bg-blue-50/70 rounded-2xl p-4 border border-blue-200">
                <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">Message Sent to Student!</h4>
                <p className="text-xs text-slate-600">
                  {selectedProduct.seller?.name} has received your inquiry. They will reply to <span className="font-bold">{currentUser?.email || 'your registered email'}</span> shortly.
                </p>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn-primary-blue px-5 py-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-[#f8f9fa] p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400">Inquiring about:</span>
                  <p className="font-bold text-slate-800">{selectedProduct.title} ({formatINR(selectedProduct.price)})</p>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    placeholder={`Hi ${selectedProduct.seller?.name}, is this still available? Can we meet at ${selectedProduct.pickupLocation || 'the campus library'} tomorrow?`}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  onClick={() => {
                    setChatSent(true);
                    showToast(`Message delivered to ${selectedProduct.seller?.name}`);
                  }}
                  className="w-full btn-primary-blue py-2.5 rounded-full font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Message</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. GEOCODING API EXACT LOCATION & HAND-OFF HUBS MODAL */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-8 max-w-lg w-full shadow-lg border border-slate-200 space-y-5 animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Exact Location Geocoding API
                  </h3>
                  <p className="text-[11px] text-slate-400">Detect or search precise campus hand-off points</p>
                </div>
              </div>
              <button
                aria-label="Close delivery modal"
                onClick={() => setIsDeliveryModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Detection Action Card */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Browser GPS Geocoding</span>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  High Accuracy
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Uses the OpenStreetMap Nominatim Geocoding API to resolve your exact campus hall, street, and coordinates automatically.
              </p>

              <button
                onClick={detectExactLocation}
                disabled={isDetectingLocation}
                className="w-full btn-primary-blue py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying Geocoding API...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4 text-blue-400" />
                    <span>Detect My Exact Campus Coordinates</span>
                  </>
                )}
              </button>

              <div className="bg-white/80 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-800 border border-blue-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Active Hub:</span>
                  <span className="font-bold text-blue-600 font-sans">{currentLocation.building}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Latitude:</span>
                  <span>{currentLocation.lat.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Longitude:</span>
                  <span>{currentLocation.lng.toFixed(6)}° W</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans truncate pt-1 border-t border-slate-100">
                  {currentLocation.displayName}
                </div>
              </div>
            </div>

            {/* Address / Campus Search with Geocoding Autocomplete */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Search Any Campus Building or Street (Forward Geocoding)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Central Library, Engineering Complex..."
                  value={geocodeQuery}
                  onChange={(e) => handleSearchGeocode(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl pr-9 focus:outline-none focus:border-blue-600"
                />
                {isSearchingGeocode ? (
                  <Loader2 className="w-4 h-4 absolute right-3 top-3 text-slate-400 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                )}
              </div>

              {geocodeSuggestions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 space-y-1 max-h-48 overflow-y-auto animate-fade-in text-xs">
                  {geocodeSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectGeocodedLocation(item)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-700 flex flex-col gap-0.5 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="text-[11px] text-slate-400 truncate">{item.displayName}</span>
                      <span className="text-[10px] font-mono text-blue-700">
                        Coord: {item.lat.toFixed(4)}°, {item.lng.toFixed(4)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Verified Campus Hubs */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Popular Verified Campus Meeting Hubs:</span>
              <div className="space-y-2">
                {[
                  { name: 'Central Campus Library', addr: 'Main University Quad', lat: 30.2849, lng: -97.7341 },
                  { name: 'Engineering Education Complex', addr: 'Tech Quad', lat: 30.2882, lng: -97.7356 },
                  { name: 'Student Activity Center', addr: 'University Center', lat: 30.2861, lng: -97.7392 },
                  { name: 'Welch Chemistry Hall', addr: 'Science Quad', lat: 30.2869, lng: -97.7378 },
                  { name: 'San Jacinto Dormitory', addr: 'Hostel Quad', lat: 30.2825, lng: -97.7328 }
                ].map(spot => (
                  <button
                    key={spot.name}
                    onClick={() => {
                      selectGeocodedLocation({
                        displayName: `${spot.name}, ${spot.addr}`,
                        name: spot.name,
                        city: 'Campus Hub',
                        lat: spot.lat,
                        lng: spot.lng
                      });
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      currentLocation.building === spot.name ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{spot.name}</p>
                      <p className="text-[11px] text-slate-400">{spot.addr}</p>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {spot.lat.toFixed(2)}°, {spot.lng.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. STUDENT AUTHENTICATION & PROFILE MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-7 max-w-md w-full shadow-lg border border-slate-200 space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-900 truncate">
                    Campus<span className="text-blue-600">Cart</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {currentUser ? 'Student Account Profile' : 'Student Marketplace Authentication'}
                  </p>
                </div>
              </div>
              <button
                aria-label="Close auth modal"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthError('');
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* IF LOGGED IN: STUDENT PROFILE & SESSION MANAGEMENT */}
            {currentUser ? (
              <div className="space-y-4 pt-1">
                {/* Profile Banner */}
                <div className="flex items-center gap-3 p-3 bg-[#f5f6f8] rounded-2xl">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-base sm:text-lg font-black shadow-xs shrink-0">
                    {(currentUser.fullName || currentUser.name || 'S')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">
                        {currentUser.fullName || currentUser.name}
                      </h4>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                        {currentUser.role || 'Student'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#f8f9fa] flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Student Roll / ID:</span>
                    <span className="font-mono font-bold text-blue-600 truncate">{currentUser.studentId || 'Not provided'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#f8f9fa] flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">College / Campus:</span>
                    <span className="font-semibold text-slate-800 text-right truncate min-w-0">{currentUser.college || 'Engineering Campus'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#f8f9fa] flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Department:</span>
                    <span className="font-semibold text-slate-800 text-right truncate min-w-0">{currentUser.department || 'Academics'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#f8f9fa] flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Verification Status:</span>
                    <span className="font-bold text-blue-700 flex items-center gap-1 shrink-0 text-right">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {currentUser.role === 'admin' ? 'Authorized Campus Admin' : 'Verified Student'}
                    </span>
                  </div>
                </div>

                {/* Fast Campus Navigation Shortcuts */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountTab('listings');
                      setCurrentView('my-listings');
                      setIsAuthModalOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">My Listings</div>
                      <div className="text-[10px] text-slate-400">Manage products</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountTab('transactions');
                      setCurrentView('my-listings');
                      setIsAuthModalOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">My Orders</div>
                      <div className="text-[10px] text-slate-400">Track {transactions.length} meetups</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCalculatorModalOpen(true);
                      setIsAuthModalOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">Resale Calculator</div>
                      <div className="text-[10px] text-slate-400">Fair price tool</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDeliveryModalOpen(true);
                      setIsAuthModalOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">Campus Hubs</div>
                      <div className="text-[10px] text-slate-400">GPS locations</div>
                    </div>
                  </button>
                </div>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* IF NOT LOGGED IN: SIGN IN OR REGISTER TABS */
              <div className="space-y-4 pt-1">
                {/* Tab Switcher */}
                <div className="grid grid-cols-2 p-1 bg-[#f1f3f5] rounded-full text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setAuthError('');
                    }}
                    className={`py-2 rounded-full transition-all cursor-pointer text-center ${
                      authTab === 'login' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('register');
                      setAuthError('');
                    }}
                    className={`py-2 rounded-full transition-all cursor-pointer text-center ${
                      authTab === 'register' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Fast Quick-Fill Demo Pills */}
                <div className="p-3 bg-blue-50/70 rounded-2xl space-y-1.5 border border-blue-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-900 font-bold">
                    <span>Quick Fill Demo Credentials:</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthEmail('student@campuscart.edu');
                        setAuthPassword('Student@123');
                        setAuthError('');
                        showToast('Filled Student credentials');
                      }}
                      className="flex-1 py-1 px-2.5 bg-white text-blue-700 rounded-lg font-bold text-[11px] border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      Demo Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthEmail('admin@campuscart.edu');
                        setAuthPassword('Admin@123');
                        setAuthError('');
                        showToast('Filled Admin credentials');
                      }}
                      className="flex-1 py-1 px-2.5 bg-white text-slate-800 rounded-lg font-bold text-[11px] border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Demo Admin
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* TAB 1: LOGIN FORM */}
                {authTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Campus Email</label>
                      <input
                        type="email"
                        required
                        placeholder="student@campuscart.edu"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Password</label>
                      <div className="relative flex items-center">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                        <button
                          type="button"
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowLoginPassword(prev => !prev)}
                          className="absolute right-3 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full btn-primary-blue py-3 rounded-full text-xs font-bold cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in to MongoDB...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>Sign In to CampusCart</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-slate-500 text-[11px] pt-1">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('register');
                          setAuthError('');
                        }}
                        className="font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Create Student Account
                      </button>
                    </p>
                  </form>
                ) : (
                  /* TAB 2: REGISTER FORM */
                  <form onSubmit={handleRegister} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Parv"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Student Roll No</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 24BCE327"
                          value={authStudentId}
                          onChange={(e) => setAuthStudentId(e.target.value)}
                          className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Department</label>
                        <input
                          type="text"
                          required
                          placeholder="Computer Science"
                          value={authDepartment}
                          onChange={(e) => setAuthDepartment(e.target.value)}
                          className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">College / Campus</label>
                      <input
                        type="text"
                        required
                        placeholder="National Institute of Technology"
                        value={authCollege}
                        onChange={(e) => setAuthCollege(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Campus Email</label>
                      <input
                        type="email"
                        required
                        placeholder="student@campuscart.edu"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Password</label>
                        <div className="relative flex items-center">
                          <input
                            type={showRegisterPassword ? "text" : "password"}
                            required
                            placeholder="Min 6 chars"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2 pr-9 text-slate-800 focus:outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowRegisterPassword(prev => !prev)}
                            className="absolute right-2.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Confirm</label>
                        <div className="relative flex items-center">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="Repeat"
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2 pr-9 text-slate-800 focus:outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-2.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full btn-primary-blue py-3 rounded-full text-xs font-bold cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering to MongoDB...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Create Account & Sign In</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-slate-500 text-[11px] pt-1">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('login');
                          setAuthError('');
                        }}
                        className="font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. ADMIN QUICK PRICE ADJUSTMENT MODAL */}
      {isAdminPriceModalOpen && adminPriceModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-8 max-w-md w-full shadow-lg border border-slate-200 space-y-5 animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Adjust Price (Admin MongoDB Sync)
                  </h3>
                  <p className="text-[11px] text-slate-400">Directly saves modified price into database</p>
                </div>
              </div>
              <button
                aria-label="Close modal"
                onClick={() => setIsAdminPriceModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-2xl border border-slate-200">
              <img
                src={adminPriceModalProduct.image}
                alt={adminPriceModalProduct.title}
                className="w-12 h-12 rounded-xl object-contain bg-white p-1"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">{adminPriceModalProduct.title}</h4>
                <p className="text-[11px] text-slate-500">Current Price: <span className="font-bold text-blue-600">{formatINR(adminPriceModalProduct.price)}</span></p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdminUpdatePrice(adminPriceModalProduct.id, adminPriceModalInput);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  New Price (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={adminPriceModalInput}
                    onChange={(e) => setAdminPriceModalInput(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 font-extrabold text-slate-800 text-base focus:outline-none focus:border-blue-600"
                    placeholder="e.g. 450"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminPriceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminPriceUpdatingId === adminPriceModalProduct.id}
                  className="flex-1 btn-primary-blue py-2.5 rounded-full font-bold text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  {adminPriceUpdatingId === adminPriceModalProduct.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. TOAST NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white px-4 py-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5 text-xs font-semibold animate-scale-up shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* 10. CAMPUS FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black text-slate-900">
                  Campus<span className="text-blue-600">Cart</span>
                </span>
              </div>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                CampusCart is a student-to-student online marketplace designed for buying, selling, and exchanging used items safely within your campus.
              </p>
              <div className="flex items-center gap-3 text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectCategory('All')}
                  className="hover:text-blue-600 cursor-pointer font-bold"
                >
                  Campus Life
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="hover:text-blue-600 cursor-pointer font-bold"
                >
                  Student Council
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilterCondition('Good');
                    setCurrentView('home');
                    document.getElementById('campus-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 cursor-pointer font-bold"
                >
                  Sustainability
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-900 text-sm">Categories</h5>
              <ul className="space-y-1.5">
                <li><button type="button" onClick={() => handleSelectCategory('Books & Notes')} className="hover:text-blue-600 cursor-pointer text-left">Textbooks & Notes</button></li>
                <li><button type="button" onClick={() => handleSelectCategory('Calculators')} className="hover:text-blue-600 cursor-pointer text-left">Calculators</button></li>
                <li><button type="button" onClick={() => handleSelectCategory('Electronics')} className="hover:text-blue-600 cursor-pointer text-left">Headphones & Electronics</button></li>
                <li><button type="button" onClick={() => handleSelectCategory('Bicycles')} className="hover:text-blue-600 cursor-pointer text-left">Bicycles & Mobility</button></li>
                <li><button type="button" onClick={() => handleSelectCategory('Lab Equipment')} className="hover:text-blue-600 cursor-pointer text-left">Lab Coats & Equipment</button></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-900 text-sm">Quick Actions</h5>
              <ul className="space-y-1.5">
                <li><button type="button" onClick={handleOpenSellModal} className="hover:text-blue-600 cursor-pointer text-left">Sell An Item</button></li>
                <li><button type="button" onClick={() => { setAccountTab('listings'); setCurrentView('my-listings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-600 cursor-pointer text-left">Manage Listings</button></li>
                <li><button type="button" onClick={() => setIsDeliveryModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Campus Delivery Hubs</button></li>
                <li><button type="button" onClick={() => setIsCalculatorModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Fair-Price Calculator</button></li>
                {currentUser?.role === 'admin' && (
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('admin');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer text-left flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-900 text-sm">Trust & Safety</h5>
              <ul className="space-y-1.5">
                <li><button type="button" onClick={() => setIsDeliveryModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Campus Meetup Hubs</button></li>
                <li><button type="button" onClick={() => setIsTermsModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Terms of Service (Honor Code)</button></li>
                <li><button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Privacy Policy (FERPA)</button></li>
                <li><button type="button" onClick={() => setIsCalculatorModalOpen(true)} className="hover:text-blue-600 cursor-pointer text-left">Resale Depreciation Calculator</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 CampusCart. Verified Student Peer-to-Peer Campus Marketplace.</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setIsDeliveryModalOpen(true)} className="hover:text-blue-600 cursor-pointer">Campus Hubs</button>
              <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="hover:text-blue-600 underline cursor-pointer">Privacy Policy</button>
              <button type="button" onClick={() => setIsTermsModalOpen(true)} className="hover:text-blue-600 underline cursor-pointer">Terms of Service</button>
              <button type="button" onClick={() => setIsCalculatorModalOpen(true)} className="hover:text-blue-600 underline cursor-pointer">Resale Tool</button>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. FORMAL COMPLIANCE & PRODUCT DEMO MODALS */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <ResaleCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onApplyToListing={(calcData) => {
          setNewListing(prev => ({
            ...prev,
            category: calcData.category,
            price: calcData.suggestedPrice.toString(),
            condition: calcData.condition
          }));
          setIsSellModalOpen(true);
        }}
      />

      {/* 12. UNIVERSITY / CAMPUS SELECTION MODAL */}
      {isUniversityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Select Your University / Campus</h3>
                  <p className="text-xs text-slate-500">Listings, hand-offs & prices are tailored to your college.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUniversityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Popular Campus Hubs
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Nirma University',
                    'National Institute of Technology',
                    'IIT Bombay',
                    'BITS Pilani',
                    'Delhi University'
                  ].map((univ) => {
                    const isSelected = activeUniversity.toLowerCase() === univ.toLowerCase();
                    return (
                      <button
                        key={univ}
                        type="button"
                        onClick={() => {
                          setUniversityInput(univ);
                          handleSelectUniversity(univ);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-[#f8fafc] text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        {univ}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Or Type Your College / University Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={universityInput}
                    onChange={(e) => setUniversityInput(e.target.value)}
                    placeholder="e.g. Nirma University, NIT Trichy, IIT Delhi..."
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectUniversity(universityInput);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSelectUniversity(universityInput)}
                className="flex-1 btn-primary-blue py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Campus Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
