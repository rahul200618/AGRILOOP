import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WasteAnalysis, FarmPlanResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    residueType: {
      type: Type.STRING,
      description: "Specific type of crop residue (e.g., Rice Straw, Wheat Stubble, Sugarcane Bagasse, Maize Stubble)."
    },
    suggestedUses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 best monetizable uses (e.g., Biofuel, Compost, Mushroom Substrate)."
    },
    transportFeasibility: {
      type: Type.STRING,
      description: "Assessment of transport feasibility (High, Medium, Low) based on bulk/density."
    },
    environmentalImpactScore: {
      type: Type.INTEGER,
      description: "A score from 1 to 10 indicating potential carbon offset if recycled (10 being highest impact)."
    },
    estimatedPriceRange: {
      type: Type.STRING,
      description: "Estimated market price range per ton in Indian Rupees (e.g., '₹3000 - ₹4500')."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level of the analysis between 0 and 1."
    }
  },
  required: ["residueType", "suggestedUses", "transportFeasibility", "environmentalImpactScore", "estimatedPriceRange", "confidence"]
};

const plannerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimalCropCount: {
      type: Type.INTEGER,
      description: "Calculated maximum number of plants that can be grown in the given area."
    },
    spacing: {
      type: Type.STRING,
      description: "Optimal spacing description (e.g., 'Row-to-Row: 30cm, Plant-to-Plant: 15cm')."
    },
    estimatedRevenue: {
      type: Type.STRING,
      description: "Estimated revenue range in Indian Rupees (₹) for one harvest cycle based on current Indian market rates."
    },
    bestSoil: {
      type: Type.STRING,
      description: "The ideal soil type for this crop (e.g., 'Loamy soil with good drainage')."
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 short actionable farming tips for this specific crop in India."
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
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analyze this agricultural image. Identify the crop waste/residue type. Suggest circular economy uses. Estimate price in Indian Rupees (₹) and environmental impact."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert Indian agricultural agronomist. Your goal is to help farmers monetize waste. Use Indian Rupees (₹) for all currency."
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
      confidence: 0.5
    };
  }
};

export const generateFarmPlan = async (length: number, breadth: number, unit: string, crop: string, state: string): Promise<FarmPlanResult> => {
  try {
    const prompt = `
      I have a farm land with dimensions: Length ${length} ${unit}, Breadth ${breadth} ${unit}.
      I want to grow: ${crop}.
      The farm is located in the Indian state of: ${state}.
      
      Act as an expert Indian Agricultural Planner.
      1. Calculate how many ${crop} plants can be optimally planted in this area.
      2. Define the standard spacing (Row-to-Row and Plant-to-Plant) used in ${state} for this crop.
      3. Estimate the potential revenue in Indian Rupees (₹) for a standard harvest based on current market prices (Mandi rates) specifically in ${state}.
      4. Recommend the best soil type.
      5. Provide 3 technical tips for higher yield specific to the climate of ${state}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: plannerSchema,
        systemInstruction: "You are an intelligent farming assistant for Indian farmers. Provide accurate calculations and financial estimates in INR (₹)."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as FarmPlanResult;

  } catch (error) {
    console.error("Gemini Planner Failed:", error);
    return {
      optimalCropCount: 0,
      spacing: "N/A",
      estimatedRevenue: "₹0",
      bestSoil: "Standard agricultural soil",
      tips: ["Ensure proper irrigation.", "Test soil pH before planting."]
    };
  }
};
