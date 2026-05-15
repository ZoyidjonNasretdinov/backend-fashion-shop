import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function testGeminiImage() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey || '');
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });

    const prompt = 'Generate an image of a red t-shirt. Return only the image part.';

    console.log('Gemini Image-ga so\'rov yuborilmoqda...');
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const parts = response.candidates?.[0]?.content?.parts;
    
    const imagePart = parts?.find(p => p.inlineData);
    if (imagePart) {
      console.log('Muvaffaqiyat! Rasm qaytdi.');
      fs.writeFileSync('gemini-test.png', Buffer.from(imagePart.inlineData!.data, 'base64'));
    } else {
      console.log('Rasm qaytmadi. Javob:', response.text());
    }
  } catch (error) {
    console.error('Xatolik:', error.message);
  }
}

testGeminiImage();
