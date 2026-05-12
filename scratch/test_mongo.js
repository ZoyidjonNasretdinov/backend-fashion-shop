
const mongoose = require('mongoose');
require('dotenv').config();

async function testMongo() {
  try {
    console.log("Checking MongoDB connection...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connection successful!");
    
    // Optional: check if we can list collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections found:", collections.map(c => c.name).join(', '));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

testMongo();
