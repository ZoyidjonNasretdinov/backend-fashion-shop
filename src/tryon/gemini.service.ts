import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  async generateTryOn(personBuffer: Buffer, productImageUrl: string, productMimetype: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });

      // Fetch product image buffer
      const response = await axios.get(productImageUrl, { responseType: 'arraybuffer' });
      const productBuffer = Buffer.from(response.data);

      const prompt = `
        You are an advanced Virtual Try-On AI. 
        I am providing two images:
        1. A person's photo.
        2. A clothing item photo.

        Your task:
        Generate a new image where the person from the first photo is wearing the clothing item from the second photo. 
        Ensure the clothing fits the person's body perfectly, respecting their pose, size, and the garment's style.
        The resulting image should look professional and realistic.
        
        Return ONLY the generated image in your response.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: personBuffer.toString('base64'),
            mimeType: 'image/jpeg',
          },
        },
        {
          inlineData: {
            data: productBuffer.toString('base64'),
            mimeType: productMimetype || 'image/jpeg',
          },
        },
      ]);

      const response_obj = result.response;
      const part = response_obj.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      
      if (part && part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }

      throw new Error('Gemini did not return an image part.');
    } catch (error) {
      console.error('Gemini TryOn Generation Error:', error);
      throw error;
    }
  }
}
