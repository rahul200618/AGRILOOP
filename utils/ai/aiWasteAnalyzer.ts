import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WasteAnalysis, FarmPlanResult, FarmInputAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    residueType: {
      type: Type.STRING,
      description: "Specific type of crop residue (e.g., Rice Straw, Wheat Stubble, Sugarcane Bagasse)."
    },
    suggestedUses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 best monetizable uses."
    },
    transportFeasibility: {
      type: Type.STRING,
      description: "Assessment of transport feasibility (High, Medium, Low)."
    },
    environmentalImpactScore: {
      type: Type.INTEGER,
      description: "Score 1-10 indicating potential carbon offset."
    },
    estimatedPriceRange: {
      type: Type.STRING,
      description: "Estimated market price range per ton in Indian Rupees (₹)."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level 0-1."
    },
    moistureContent: {
      type: Type.STRING,
      description: "Visual estimate of moisture content percentage (e.g., '10-15%')."
    },
    purityScore: {
      type: Type.INTEGER,
      description: "Visual estimate of material purity 0-100 (freedom from dirt/weeds)."
    },
    co2Saved: {
      type: Type.NUMBER,
      description: "Estimated kg of CO2 saved per ton if recycled instead of burned."
    }
  },
  required: ["residueType", "suggestedUses", "transportFeasibility", "environmentalImpactScore", "estimatedPriceRange", "confidence", "moistureContent", "purityScore", "co2Saved"]
};

const learningHubSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: ['CROP', 'FERTILIZER', 'SOIL', 'UNKNOWN'],
      description: "The category of the item in the image."
    },
    name: {
      type: Type.STRING,
      description: "Name of the crop, fertilizer, or soil type identified."
    },
    summary: {
      type: Type.STRING,
      description: "A simple, short explanation suitable for a farmer."
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 actionable tips for best results."
    },
    healthScore: {
      type: Type.INTEGER,
      description: "Visual health/quality score from 0-100 (if applicable)."
    }
  },
  required: ["type", "name", "summary", "tips"]
};

const plannerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimalCropCount: {
      type: Type.INTEGER,
      description: "Calculated maximum number of plants."
    },
    spacing: {
      type: Type.STRING,
      description: "Optimal spacing description."
    },
    estimatedRevenue: {
      type: Type.STRING,
      description: "Estimated revenue range in Indian Rupees (₹)."
    },
    bestSoil: {
      type: Type.STRING,
      description: "The ideal soil type for this crop."
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 short actionable farming tips."
    }
  },
  required: ["optimalCropCount", "spacing", "estimatedRevenue", "bestSoil", "tips"]
};

export const analyzeCropWaste = async (base64Image: string): Promise<WasteAnalysis> => {
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: "Analyze this agricultural image. Identify residue type, moisture, purity, price in INR, and CO2 impact." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert Indian agricultural agronomist. Use Indian Rupees (₹)."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WasteAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      residueType: "Unknown Biomass",
      suggestedUses: ["Composting", "Biomass Fuel"],
      transportFeasibility: "Medium",
      environmentalImpactScore: 5,
      estimatedPriceRange: "₹800 - ₹1200",
      confidence: 0.5,
      moistureContent: "Unknown",
      purityScore: 50,
      co2Saved: 100
    };
  }
};

export const generateFarmPlan = async (length: number, breadth: number, unit: string, crop: string, state: string): Promise<FarmPlanResult> => {
  try {
    const prompt = `
      Farm dimensions: ${length} ${unit} x ${breadth} ${unit}. Crop: ${crop}. State: ${state}.
      Calculate optimal plants, spacing, revenue in INR, soil, and tips.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: plannerSchema,
        systemInstruction: "You are an intelligent farming assistant for Indian farmers."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as FarmPlanResult;
  } catch (error) {
    return {
      optimalCropCount: 0,
      spacing: "N/A",
      estimatedRevenue: "₹0",
      bestSoil: "Standard agricultural soil",
      tips: ["Ensure proper irrigation.", "Test soil pH."]
    };
  }
};

export const analyzeFarmInput = async (base64Image: string): Promise<FarmInputAnalysis> => {
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: "Identify this farm input (Crop, Soil, or Fertilizer). Provide a summary and tips for an Indian farmer." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: learningHubSchema,
        systemInstruction: "You are a helpful agricultural teacher. Explain simply."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as FarmInputAnalysis;
  } catch (error) {
    return {
      type: 'UNKNOWN',
      name: 'Unknown Item',
      summary: 'Could not identify. Please try again.',
      tips: [],
      healthScore: 0
    };
  }
};