# CampusCart 🎓🛒
### Student-to-Student College Marketplace

**Project Team:** NexByte  
**Roll Numbers:** `24BCE321`, `24BCE327`  
**Language:** English Only  
**Tech Stack:** React.js, Tailwind CSS, Normal CSS, Node.js, Express, MongoDB (Mongoose), OpenStreetMap Geocoding API


##  Project Overview

**CampusCart** is a student-to-student online marketplace designed for buying, selling, and exchanging used items within a college campus. Students can list products such as textbooks, calculators, electronics, bicycles, furniture, lab equipment, and other useful items.

Users can browse products, search and filter listings, view product details, contact sellers, and manage their own listings. The platform provides secure user authentication, product management, wishlist functionality, and transaction tracking. An admin dashboard can be used to manage users and inappropriate listings. CampusCart aims to provide students with a convenient, affordable, and organized platform for campus-based item exchange.

---

## 🌍 Geocoding API Integration (Exact Location Detection)

CampusCart integrates the **OpenStreetMap Nominatim Geocoding API** for exact, GPS-accurate campus hand-offs:

1. **Browser GPS Geocoding (`/api/geocode/reverse`)**:
   - Students can click **"Detect Exact GPS"** in the top bar, delivery modal, checkout page, or listing form.
   - Leverages `navigator.geolocation.getCurrentPosition` with high precision.
   - Resolves exact building name (e.g. *Central Library*, *Engineering Complex*), street address, city, and GPS coordinates (`latitude`, `longitude`).
2. **Forward Geocoding Search (`/api/geocode/search`)**:
   - Students can search any campus hall, street, or hub name with real-time autocompletion.
   - Provides live pin coordinates (`Lat: 30.2849° N, Lng: 97.7341° W`).
3. **Mongoose Geocoded Storage**:
   - Product listings and orders store `location.coordinates { lat, lng }` in MongoDB via Mongoose.
   - Product detail views feature a direct **"Open on Map"** link to OpenStreetMap for verified hand-off spots.

---

##  User Authentication & MongoDB Database System

CampusCart incorporates a secure **JWT-based Authentication System** connected to **MongoDB via Mongoose**:

- **MongoDB User Schema**:
  - `fullName`: Student's full name.
  - `email`: College student email (unique, lowercase).
  - `password`: Securely hashed with `bcryptjs` (salt rounds: 10).
  - `studentId`: Official student roll number (e.g. `24BCE321`).
  - `college`: Institute or campus branch name.
  - `department`: Major/branch (e.g. `Computer Science and Engineering`).
  - `academicYear`: Current year (`1st Year` to `4th Year` / `Staff`).
  - `role`: Access level (`student` or `admin`).
- **Authentication Endpoints**:
  - `POST /api/auth/register`: Creates new student account, hashes password, saves to MongoDB, issues JWT token.
  - `POST /api/auth/login`: Authenticates student credentials, validates password, issues JWT token.
  - `GET /api/auth/me`: Authenticated endpoint verifying JWT Bearer token and returning student profile.
- **Demo Accounts for Fast Evaluation**:
  - **Student Account**: `student@campuscart.edu` / `Student@123` (Name: `Parv`, Roll: `24BCE327`)
  - **Admin Account**: `admin@campuscart.edu` / `Admin@123` (Roll: `ADMIN-01`)
- **Strict Product Listing Gating**:
  - **Without logging in, users cannot add products or list items.**
  - Attempting to list an item or manage listings without authentication automatically triggers the sign-in modal with a clear notification prompt.
  - Once signed in, products created by students are stored in MongoDB with the student's authenticated ID and details.

---

## 🇮🇳 Indian Rupees Currency System (₹ / INR)

CampusCart is completely tailored to the **Indian Rupee system (`₹` / INR)**:
- **Zero Dollar Signs**: All product listings, cart calculations, orders, and receipts operate in Rupees.
- **Standard Formatting (`en-IN`)**: Numbers format cleanly to the Indian numbering system using `formatINR()` (e.g. `₹450`, `₹1,499`, `₹4,200`, `₹49,900`).
- **Student Budget Price Filters**:
  - `Under ₹500` (Pocket-money items, stationery, notes)
  - `₹500 - ₹1,500` (Calculators, textbooks, lab kits)
  - `₹1,500 - ₹5,000` (Bicycles, headphones, furniture)
  - `Over ₹5,000` (Laptops, tablets, premium gadgets)
- **Campus Transaction Tracking & Ledger**:
  - Students can track past orders, current status (`Pending`, `Accepted`, `Completed`), and exact hand-off coordinates in Rupees.
  - Campus administrators can audit the live **Campus Transaction Ledger** and total campus trade volume in Rupees (`₹ INR`).
- **Campus Payment Integrations**:
  - Cash on Campus Meetup (`₹ INR Cash`)
  - CampusCart Student Wallet (`₹ INR Balance`)
  - UPI / Google Pay / PhonePe / Paytm (`₹`)
  - RuPay / Debit / Credit Card (`₹`)

---

## ✨ Design Aesthetics & UI Style

CampusCart is crafted with the modern, high-converting e-commerce aesthetic shown in the design mockups:
- **Brand Green Theme (`#003d29`)**: Deep forest green top announcement bar, primary action buttons, and accents.
- **Warm Peach Hero Banner (`#fcede3`)**: Prominent announcement banner featuring 50% off deals with pill-shaped action buttons and student lifestyle visuals.
- **Filter Chips Row**: 7 interactive pill dropdowns for Category, Condition, Price, Campus Location, Status, Offers, and Sort by.
- **Product Card Grid**: Clean `#f5f6f8` image backdrops with interactive heart wishlist buttons, emerald 5-star rating badges, student department tags, coordinates badge, and instant "Add to Cart" actions.
- **Product Details View**: Multi-angle image thumbnails, interactive color swatches (Coral Pink, Dark Gray, Mint Green, Silver White, Sky Blue), quantity stepper `[-] 1 [+]`, stock indicator, verified seller badges, and safe campus exchange policies.
- **Delivery Information & Payment Checkout**: Comprehensive checkout flow covering Student Name, Roll Number, Campus Meetup Point, Mobile, and payment methods (Cash on Campus Meetup, CampusCart Student Wallet, Online Pay, Credit/Debit card).
- **Slide-Over Shopping Cart Drawer**: Quick view cart drawer with quantity modifiers, free campus hand-delivery indicator, and subtotal calculation.

---

## 🚀 Key Features

| Category | Feature | Description |
| :--- | :--- | :--- |
| **Catalog & Discovery** | Multi-Category Marketplace | Browse Textbooks & Notes, Electronics, Calculators, Lab Equipment, Bicycles, Furniture, and Dorm Essentials. |
| **Search & Filtering** | Instant Multi-Param Filter | Live keyword search across title, description, and campus, with filters for condition, price, and campus location. |
| **Exact Geocoding** | Nominatim GPS Pinning | Real-time GPS location detection and forward geocoding autocomplete for exact hand-off spots. |
| **Product Details** | Interactive Detail View | Includes verified student profile, condition grade, multi-color swatches, coordinates, and campus hand-off spots. |
| **Direct Communication** | Contact Seller Modal | Send direct messages to student sellers to coordinate inspection and meeting times. |
| **Selling & Listings** | Post An Item with GPS Pin | Simple listing creator for students to upload item details, condition, price, and exact geocoded pickup spot. |
| **Listing Management** | My Listings Manager | Real-time status toggles (`Available`, `Reserved`, `Sold`) and listing deletion. |
| **Student Wishlist** | Saved Items | One-click heart toggle to save desired campus items across sessions. |
| **Campus Checkout** | Safe Meetup Checkout | Complete order confirmation with hand-off locations (e.g. Central Library Quad, Student Center, Tech Quad). |
| **Administration** | Admin Moderation Panel | Campus statistics, user status controls, and reports resolver to remove inappropriate listings. |
| **Mongoose Backend** | Resilient Architecture | Full Mongoose models for products, users, transactions, and reports with graceful offline fallback. |

---

## 🛠️ Technology Stack

- **Frontend**:
  - **Framework**: React 18 (SPA)
  - **Bundler**: Vite 6
  - **Styling**: Tailwind CSS v4 + Normal Vanilla CSS (`client/src/index.css`)
  - **Icons**: Lucide React
  - **HTTP Client**: Axios
  - **Language**: English Only (JavaScript ESM / JSX)
- **Backend**:
  - **Runtime**: Node.js
  - **Framework**: Express.js
  - **ODM**: Mongoose 8.x
  - **Database**: MongoDB
  - **Geocoding**: OpenStreetMap Nominatim Reverse & Forward Geocoding API
  - **Authentication**: JWT & bcryptjs
  - **CORS & Cookies**: Enabled for secure cross-origin communication

---

## 📁 Repository Structure

See the complete, detailed architectural breakdown in [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

```text
FSD_Final/
├── client/                     # Frontend Application
│   ├── index.html              # HTML entry with CampusCart branding
│   ├── vite.config.js          # Vite config with Tailwind & proxy
│   ├── package.json            # Client dependencies
│   └── src/
│       ├── main.jsx            # React root mount
│       ├── index.css           # Design tokens, keyframe animations, normal CSS
│       └── App.jsx             # Complete CampusCart SPA implementation
├── server/                     # Backend Application
│   ├── .env                    # Environment variables
│   ├── package.json            # Server dependencies
│   └── server.js               # Express API, Mongoose schemas & Geocoding endpoints
├── package.json                # Monorepo runner (concurrently)
├── README.md                   # Project documentation (this file)
└── PROJECT_STRUCTURE.md        # Architectural documentation
```

---

## 💻 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **MongoDB** (Optional: the app connects to MongoDB via Mongoose and includes in-memory & localStorage fallback if MongoDB is not running locally)

### 2. Installation
Install all root, client, and server dependencies with a single command:
```bash
npm run install:all
```

### 3. Run the Development Server
Start both the Express backend and Vite frontend concurrently:
```bash
npm start
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`
- **Geocoding Reverse API**: `http://localhost:5000/api/geocode/reverse?lat=30.2849&lng=-97.7341`
- **Geocoding Search API**: `http://localhost:5000/api/geocode/search?q=Central+Library+Austin`

---

## 👥 Student & Demo Credentials

- **Demo Student Profile**: Parv (`24BCE327`) — `student@campuscart.edu` / `Student@123`
- **Administrator Email**: `admin@campuscart.edu` / `Admin@123`

You can toggle between **Student View** and **Admin View** at any time by clicking the **Account** button in the top navigation bar.

---

## 📄 License & Academic Attribution
Developed as part of the Full Stack Development (FSD) curriculum by **Team NexByte** (`24BCE321`, `24BCE327`).
All rights reserved © 2026 CampusCart.
