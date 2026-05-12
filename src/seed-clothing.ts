import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://kamronbeksodiqjonon_db_user:BTvK35H9jVljCRWE@cluster0.4nvyfku.mongodb.net/?appName=Cluster0';

async function seedClothing() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const seller = (await mongoose.connection.db.collection('users').findOne({ email: 'seller@fashion.com' })) as any;
    
    if (!seller) {
      console.error('Seller not found! Please run the user seed script first.');
      process.exit(1);
    }

    const ClothingSchema = new mongoose.Schema({
      name: String,
      size: String,
      color: String,
      price: Number,
      description: String,
      images: [String],
      sellerId: mongoose.Schema.Types.ObjectId,
      discount: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    }, { timestamps: true });

    // NestJS defaults to lowercase collection names with an 's' suffix
    const Clothing = mongoose.model('Clothing', ClothingSchema, 'clothings');

    const items = [
      {
        name: 'Klassik Erkaklar Kostyumi',
        size: 'L',
        color: 'To\'q ko\'k',
        price: 1200000,
        description: 'Rasmiy tadbirlar uchun sifatli erkaklar kostyumi.',
        images: ['https://images.unsplash.com/photo-1594932224828-b4b057b6d6ee?q=80&w=1000&auto=format&fit=crop'],
      },
      {
        name: 'Yozgi Ayollar Ko\'ylagi',
        size: 'M',
        color: 'Oq',
        price: 350000,
        description: 'Yengil va havo o\'tkazuvchan yozgi ko\'ylak.',
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop'],
      },
      {
        name: 'Sport Oyoq Kiyimi (Sneakers)',
        size: '42',
        color: 'Qora/Oq',
        price: 550000,
        description: 'Kundalik yugurish va sport uchun qulay krossovkalar.',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
      },
      {
        name: 'Jinsi Shim (Slim Fit)',
        size: '32',
        color: 'Moviy',
        price: 280000,
        description: 'Sifatli denimlardan tikilgan zamonaviy jinsi shim.',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop'],
      },
      {
        name: 'Qishki Kurtka (Puffer)',
        size: 'XL',
        color: 'Yashil',
        price: 850000,
        description: 'Sovuq kunlar uchun issiq va yengil kurtka.',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'],
      }
    ];

    for (const item of items) {
      const newClothing = new Clothing({
        ...item,
        sellerId: seller!._id,
      });
      await newClothing.save();
      console.log(`Created: ${item.name}`);
    }

    console.log('Sample clothing items created successfully!');
  } catch (error) {
    console.error('Seeding clothing failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedClothing();
