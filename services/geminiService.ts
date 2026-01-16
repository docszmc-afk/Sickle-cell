
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for ZMC SickleCare Initiative (ZSI), established under the ASH International Outreach Initiative. 
Your tone is compassionate, professional, and informative.
ZMC SickleCare is affiliated with Zankli Medical Centre and Succour Foundation.
Your mission is to heighten awareness, education, and support for sickle cell disease (SCD).
Provide accurate information about SCD prevention, management, and psychosocial support based on medical consensus.
Always include a disclaimer that you are an AI and users should consult Zankli Medical Centre or another medical professional for personal diagnosis.
Use concise formatting with bullet points where appropriate.
Support languages like English and local Nigerian dialects (Yoruba, Igbo, Hausa, Pidgin) if requested.
`;

export class SickleCareAI {
  constructor() {}

  /**
   * Generates a streaming chat response using Gemini 3 Flash.
   * @param history - Previous conversation messages.
   * @param message - The current user prompt.
   */
  async *chat(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) {
    // Fix: Create a new GoogleGenAI instance inside the method using process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Initialize chat with existing history to maintain context.
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // Fix: Use sendMessageStream to get real-time responses.
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      // Fix: Directly access chunk.text as a property.
      yield chunk.text;
    }
  }
}

export const sickleCareAI = new SickleCareAI();
