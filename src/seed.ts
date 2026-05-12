import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

const MONGODB_URI = 'mongodb+srv://kamronbeksodiqjonon_db_user:BTvK35H9jVljCRWE@cluster0.4nvyfku.mongodb.net/?appName=Cluster0';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const UserSchema = new mongoose.Schema({
      fullName: String,
      email: String,
      passwordHash: String,
      role: String,
    }, { timestamps: true });

    // NestJS defaults to lowercase collection names with an 's' suffix
    const User = mongoose.model('User', UserSchema, 'users');

    const users = [
      { fullName: 'System Admin', email: 'admin@fashion.com', password: 'admin123', role: Role.ADMIN },
      { fullName: 'Fashion Seller', email: 'seller@fashion.com', password: 'seller123', role: Role.SELLER },
      { fullName: 'Standard User', email: 'user@fashion.com', password: 'user123', role: Role.USER },
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User ${u.email} already exists`);
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      const newUser = new User({
        fullName: u.fullName,
        email: u.email,
        passwordHash,
        role: u.role,
      });

      await newUser.save();
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
