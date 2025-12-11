import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are HemoBot, an expert AI assistant for a Blood Bank Management System.
Your role is to assist administrators and medical staff with:
1. Blood compatibility (e.g., "Can O+ donate to A+?").
2. Storage and handling guidelines for blood components.
3. Donor eligibility criteria based on WHO/Red Cross standards.
4. Analyzing trends if data is provided.

Keep your answers concise, professional, and medically accurate. 
If a query is about a specific medical emergency, advise them to consult a doctor immediately.
Do not make up medical facts.
`;

export const sendMessageToGemini = async (message: string, history: string[] = []): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware prompt
    const prompt = `
      Previous conversation context: ${history.join('\n')}
      User Query: ${message}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently unable to connect to the server. Please check your API key or internet connection.";
  }
};