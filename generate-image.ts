import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('API Key available:', !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    console.log('Generating image...');
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: 'Uma cozinha industrial moderna e profissional, totalmente equipada com superfícies em aço inoxidável brilhante, fogões industriais, coifas de exaustão grandes, bancadas organizadas e equipamentos de alta performance. Ambiente limpo, sofisticado e bem iluminado, com luz branca fria destacando o brilho do inox. A cozinha deve transmitir organização, eficiência e padrão profissional de restaurante. Incluir detalhes como panelas industriais, utensílios organizados, refrigeradores comerciais e área de preparo ampla. Estilo fotográfico realista, ultra realista, alta definição (8K), iluminação cinematográfica, profundidade de campo, reflexos naturais no inox. Perspectiva em ângulo amplo (wide angle), mostrando toda a estrutura da cozinha. Sem pessoas, foco total no ambiente. Cores predominantes: prata (inox), preto, cinza e tons frios.',
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const buffer = Buffer.from(base64Data, 'base64');
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir);
        }
        fs.writeFileSync(path.join(publicDir, 'hero-kitchen.png'), buffer);
        console.log('Image saved successfully to public/hero-kitchen.png');
        break;
      }
    }
  } catch (error) {
    console.error('Error generating image:', error);
    process.exit(1);
  }
}

main();
