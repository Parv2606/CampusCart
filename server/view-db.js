const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configure public DNS servers to prevent Windows querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns servers cannot be set
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuscart';

async function viewDatabase() {
  try {
    console.log('\n======================================================');
    console.log('📦 CAMPUSCART DATABASE INSPECTOR');
    console.log(`Connecting to: ${MONGO_URI}`);
    console.log('======================================================\n');

    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} Collections in database:`);
    collections.forEach(c => console.log(`  📁 ${c.name}`));
    console.log('------------------------------------------------------\n');

    // 1. Users
    const users = await db.collection('users').find({}).toArray();
    console.log(`👥 USERS COLLECTION (${users.length} records):`);
    console.table(users.map(u => ({
      ID: u._id.toString().slice(-6),
      Name: u.fullName,
      Email: u.email,
      StudentId: u.studentId,
      Role: u.role,
      College: u.college
    })));

    // 2. Products
    const products = await db.collection('products').find({}).toArray();
    console.log(`\n📚 PRODUCTS COLLECTION (${products.length} records):`);
    console.table(products.map(p => ({
      ID: p._id.toString().slice(-6),
      Title: p.title.slice(0, 30),
      College: p.college || 'N/A',
      Category: p.category,
      Price: `₹${p.price}`,
      Condition: p.condition,
      Status: p.status
    })));

    // 3. Wishlists
    const wishlists = await db.collection('wishlists').find({}).toArray();
    console.log(`\n💖 WISHLISTS COLLECTION (${wishlists.length} records):`);
    if (wishlists.length === 0) {
      console.log('  (No items added to wishlist yet. Click heart on any item!)');
    } else {
      console.table(wishlists.map(w => ({
        ID: w._id.toString().slice(-6),
        User_ID: w.user?.toString().slice(-6),
        Product_ID: w.product?.toString().slice(-6),
        SavedAt: w.createdAt ? new Date(w.createdAt).toLocaleTimeString() : 'N/A'
      })));
    }

    // 4. Transactions
    const transactions = await db.collection('transactions').find({}).toArray();
    console.log(`\n💳 TRANSACTIONS COLLECTION (${transactions.length} records):`);
    if (transactions.length === 0) {
      console.log('  (No orders placed yet. Add items to cart and checkout to create a transaction!)');
    } else {
      console.table(transactions.map(t => ({
        ID: t._id.toString().slice(-6),
        Product_ID: t.product?.toString().slice(-6),
        Buyer_ID: t.buyer?.toString().slice(-6),
        Status: t.status,
        DeliverySpot: t.deliveryLocation?.address?.slice(0, 30),
        Payment: t.paymentMethod
      })));
    }

    console.log('\n======================================================');
    console.log('✅ Inspection Complete.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

viewDatabase();
