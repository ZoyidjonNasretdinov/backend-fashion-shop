import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey || '');
  
  // Modelni tanlaymiz
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  // Ishonchliroq rasmlar
  const personUrl = 'https://raw.githubusercontent.com/google-gemini/cookbook/main/examples/data/test_image_1.jpg';
  const garmentUrl = 'https://raw.githubusercontent.com/google-gemini/cookbook/main/examples/data/test_image_2.jpg';

  try {
    console.log('Rasmlar yuklanmoqda...');
    const personRes = await axios.get(personUrl, { responseType: 'arraybuffer' });
    const garmentRes = await axios.get(garmentUrl, { responseType: 'arraybuffer' });

    console.log('Gemini-ga so\'rov yuborilmoqda...');
    const result = await model.generateContent([
      'What are in these two images? Describe them.',
      {
        inlineData: {
          data: Buffer.from(personRes.data).toString('base64'),
          mimeType: 'image/jpeg',
        },
      },
      {
        inlineData: {
          data: Buffer.from(garmentRes.data).toString('base64'),
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    console.log('Javob:', response.text());
  } catch (error) {
    console.error('Xatolik:', error.message);
  }
}

testGemini();
