export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  NONE = 'NONE'
}

export interface WasteAnalysis {
  residueType: string;
  suggestedUses: string[];
  transportFeasibility: string;
  environmentalImpactScore: number; // 1-10
  estimatedPriceRange: string;
  confidence: number;
}

export interface FarmPlanResult {
  optimalCropCount: number;
  spacing: string;
  estimatedRevenue: string;
  bestSoil: string;
  tips: string[];
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

export interface Listing {
  id: string;
  farmerName: string;
  image: string; // Base64
  analysis: WasteAnalysis;
  quantity: number; // in tons
  location: string;
  status: ListingStatus;
  timestamp: number;
  bids: Bid[];
  acceptedBidId?: string;
  proofImage?: string;
  proofLocation?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  carbonPoints: number;
  walletBalance: number;
}