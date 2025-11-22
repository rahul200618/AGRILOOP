import React, { useState } from 'react';
import { Button } from '../components/Common/Button';
import { generateFarmPlan } from '../utils/ai/aiWasteAnalyzer';
import { FarmPlanResult } from '../utils/types';
import { Calculator, Ruler, Sprout, Droplets, ClipboardList, MapPin } from 'lucide-react';

export const FarmingGuideScreen: React.FC = () => {
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [crop, setCrop] = useState('Rice (Paddy)');
  const [selectedState, setSelectedState] = useState('Punjab');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FarmPlanResult | null>(null);

  const crops = [
    'Rice (Paddy)', 'Wheat', 'Sugarcane', 'Cotton', 'Maize (Corn)', 
    'Tomato', 'Potato', 'Mustard', 'Soybean', 'Onion', 'Turmeric'
  ];

  const indianStates = [
    'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh',
    'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Karnataka',
    'Tamil Nadu', 'West Bengal', 'Bihar', 'Rajasthan', 'Telangana',
    'Odisha', 'Kerala', 'Assam', 'Chhattisgarh', 'Jharkhand', 'Uttarakhand'
  ];

  const handlePlan = async () => {
    if (!length || !breadth) return;
    setIsLoading(true);
    try {
      const data = await generateFarmPlan(parseFloat(length), parseFloat(breadth), unit, crop, selectedState);
      setResult(data);
    } catch (e) {
      alert("Planning failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in">
      <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator size={24} /> Farm Planner
        </h2>
        <p className="text-green-100 mt-2 opacity-90">
          Optimize your yield and estimate revenue with AI-driven planning tailored for your state's market rates.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Land Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Length</label>
            <div className="relative">
               <input 
                type="number" 
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Breadth</label>
            <input 
              type="number" 
              value={breadth}
              onChange={(e) => setBreadth(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Unit</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setUnit('feet')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${unit === 'feet' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
            >
              Feet (ft)
            </button>
            <button 
              onClick={() => setUnit('meters')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${unit === 'meters' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
            >
              Meters (m)
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 pt-2">Crop & Location</h3>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
            State <span className="text-gray-400 font-normal">(For accurate pricing)</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none text-gray-700"
            >
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Crop to Plant</label>
          <select 
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none text-gray-700"
          >
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <Button onClick={handlePlan} isLoading={isLoading}>
          Calculate Yield & Revenue
        </Button>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-gray-800 px-2">Planner Results</h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center border-b border-green-100">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Projected Revenue in {selectedState}</p>
              <h2 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-1">
                {result.estimatedRevenue}
              </h2>
              <p className="text-xs text-green-600 mt-2 bg-white/60 inline-block px-3 py-1 rounded-full">
                Based on {selectedState} Mandi prices
              </p>
            </div>

            <div className="p-5 grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Sprout size={16} /> Plants Count
                </div>
                <p className="text-xl font-bold text-gray-800">{result.optimalCropCount}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Ruler size={16} /> Optimal Spacing
                </div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{result.spacing}</p>
              </div>
            </div>
            
            <div className="px-5 pb-5">
               <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Droplets size={16} /> Soil Recommendation
                </div>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {result.bestSoil}
                </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
              <ClipboardList size={18} /> Tips for {selectedState}
            </h4>
            <ul className="space-y-2">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};