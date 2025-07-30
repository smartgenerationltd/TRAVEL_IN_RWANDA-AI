
import { GoogleGenAI, Chat } from '@google/genai';

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public createChat(systemInstruction: string): Chat {
    return this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });
  }
}

export const geminiService = new GeminiService();
