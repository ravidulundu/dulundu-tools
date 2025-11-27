import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCodeHelp = async (prompt: string, language: string = 'javascript'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert developer assistant. The user needs help with ${language}. 
      
      Task: ${prompt}
      
      Provide a clean, well-commented code solution or explanation. If generating code, wrap it in markdown code blocks. Keep the text concise.`,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key or try again later.";
  }
};

export const paraphraseText = async (text: string, tone: string = 'professional'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert writer. Paraphrase the following text to be more ${tone}. Keep the meaning the same but improve clarity and flow.
      
      Text: "${text}"
      
      Output only the paraphrased text.`,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key or try again later.";
  }
};