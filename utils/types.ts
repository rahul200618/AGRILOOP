
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  HOUSEHOLD = 'HOUSEHOLD',
  BIOGAS = 'BIOGAS',
  LEARNER = 'LEARNER',
  NONE = 'NONE'
}

export interface WasteAnalysis {
  residueType: string;
  suggestedUses: string[];
  transportFeasibility: string;
  environmentalImpactScore: number; // 1-10
  estimatedPriceRange: string;
  confidence: number;
  // Enhanced 2.0 Fields
  moistureContent?: string; // e.g. "10-15%"
  purityScore?: number; // 0-100
  co2Saved?: number; // Estimated kg of CO2 saved if not burned
}

export interface FarmPlanResult {
  optimalCropCount: number;
  spacing: string;
  estimatedRevenue: string;
  bestSoil: string;
  tips: string[];
}

export interface FarmInputAnalysis {
  type: 'CROP' | 'FERTILIZER' | 'SOIL' | 'UNKNOWN';
  name: string;
  summary: string;
  tips: string[];
  healthScore?: number; // For soil/crop
}

export enum ListingStatus {
  OPEN = 'OPEN',
  PENDING_PICKUP = 'PENDING_PICKUP',
  COMPLETED = 'COMPLETED'
}

export interface Bid {
  id: string;
  buyerName: string;
  amount: number;
  pickupTime: string;
  buyerReliabilityScore: number;
}

export type WasteCategory = 'FARM_CROP' | 'HOUSEHOLD_WASTE';
export type Degradability = 'DEGRADABLE' | 'NON_DEGRADABLE' | 'N/A';

export interface Listing {
  id: string;
  farmerName: string; // Used for Household name as well
  image: string; // Base64
  analysis: WasteAnalysis;
  quantity: number; // in tons or kg
  location: string;
  status: ListingStatus;
  timestamp: number;
  bids: Bid[];
  acceptedBidId?: string;
  proofImage?: string;
  proofLocation?: string;
  
  // New fields for Household/Biogas feature
  wasteCategory?: WasteCategory;
  degradability?: Degradability;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  carbonPoints: number;
  walletBalance: number;
}


