
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getFinancialAdvice(transactions: Transaction[]): Promise<string> {
    if (transactions.length === 0) return "Add some transactions to get AI-powered financial insights.";

    const dataSummary = transactions.map(t => `${t.date}: ${t.type} of ${t.amount} for ${t.description}`).join('\n');
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these financial transactions and provide 3 concise, actionable pieces of advice to improve financial health. Keep it brief and professional.\n\n${dataSummary}`,
      });
      return response.text || "Unable to generate insights at this time.";
    } catch (error) {
      console.error("Gemini Advice Error:", error);
      return "Advice unavailable. Please check your connection.";
    }
  }

  async suggestCategory(description: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a single, one-word category for this financial transaction description: "${description}". Output only the category name.`,
      });
      return response.text?.trim() || "General";
    } catch (error) {
      return "General";
    }
  }
}

export const geminiService = new GeminiService();
