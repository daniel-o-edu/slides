import { GoogleGenAI, Type } from "@google/genai";
import { PresentationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlidesFromText = async (text: string): Promise<PresentationData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a presentation based on the following text/topic: "${text}". 
      Break it down into logical slides. 
      The first slide should be a Title slide. 
      The last slide should be a Summary slide.
      Keep bullet points concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "The main topic/title of the presentation" },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Array of bullet points or text paragraphs" 
                  },
                  type: { 
                    type: Type.STRING, 
                    enum: ["title", "content", "summary"],
                    description: "The layout type of the slide" 
                  },
                  notes: { type: Type.STRING, description: "Speaker notes for this slide" }
                },
                required: ["title", "content", "type"]
              }
            }
          },
          required: ["topic", "slides"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as PresentationData;
      return data;
    }
    
    throw new Error("No content generated");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
