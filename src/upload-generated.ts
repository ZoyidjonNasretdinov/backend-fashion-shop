import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

const CLOUDINARY_CLOUD_NAME = 'duqptnkpo';
const CLOUDINARY_API_KEY = '472624132198669';
const CLOUDINARY_API_SECRET = 'TmK97cOAH6CwW6zPf5vGPJTWBEg';
const MONGODB_URI = 'mongodb+srv://kamronbeksodiqjonon_db_user:BTvK35H9jVljCRWE@cluster0.4nvyfku.mongodb.net/?appName=Cluster0';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadAndSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Clothing = mongoose.connection.db.collection('clothings');

    const images = [
      { name: 'Klassik Erkaklar Kostyumi', path: '/Users/apple/.gemini/antigravity/brain/01e4982d-177d-4521-a1d8-6351f872c84f/elegant_suit_1778310614669.png' },
      { name: 'Yozgi Ayollar Ko\'ylagi', path: '/Users/apple/.gemini/antigravity/brain/01e4982d-177d-4521-a1d8-6351f872c84f/summer_dress_1778310636173.png' },
      { name: 'Sport Oyoq Kiyimi (Sneakers)', path: '/Users/apple/.gemini/antigravity/brain/01e4982d-177d-4521-a1d8-6351f872c84f/modern_sneakers_1778310660492.png' },
    ];

    for (const img of images) {
      console.log(`Uploading ${img.name} from ${img.path}...`);
      const result = await cloudinary.uploader.upload(img.path, { folder: 'fashion-shop' });
      console.log(`Uploaded to Cloudinary: ${result.secure_url}`);

      const updateResult = await Clothing.updateOne(
        { name: img.name },
        { $set: { images: [result.secure_url] } }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log(`Successfully updated database for ${img.name}`);
      } else {
        console.log(`No matching document found for ${img.name} to update.`);
      }
    }

    console.log('All images uploaded and database updated!');
  } catch (error) {
    console.error('Error during upload and seed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

uploadAndSeed();
