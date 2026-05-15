import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function testImagen() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey || '');
  
  try {
    // Imagen 4.0 modelini tekshiramiz
    const model = genAI.getGenerativeModel({ model: 'imagen-4.0-generate-001' });

    const prompt = 'A stylish man wearing a classic blue suit, high quality, professional photography.';

    console.log('Imagen-ga so\'rov yuborilmoqda...');
    // Imagen odatda generateContent emas, balki predict yoki maxsus metodlar bilan ishlaydi
    // Lekin Google AI SDK da rasm generatsiya qilish uchun generateContent ishlatilishi ham mumkin
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const parts = response.candidates?.[0]?.content?.parts;
    
    const imagePart = parts?.find(p => p.inlineData);
    if (imagePart) {
      console.log('Muvaffaqiyat! Imagen rasm qaytardi.');
      fs.writeFileSync('imagen-test.png', Buffer.from(imagePart.inlineData!.data, 'base64'));
    } else {
      console.log('Rasm qaytmadi. Javob:', response.text());
    }
  } catch (error) {
    console.error('Xatolik:', error.message);
  }
}

testImagen();
