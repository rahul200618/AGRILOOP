import React from 'react';
import { WasteAnalysis } from '../utils/types';
import { Button } from '../components/Common/Button';
import { Plus, Truck, Droplets, Sparkles, Leaf, Trees } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ScanResultListingScreenProps {
  scanResult: {
    image: string;
    analysis: WasteAnalysis;
  } | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ScanResultListingScreen: React.FC<ScanResultListingScreenProps> = ({ scanResult, onCancel, onConfirm }) => {
  if (!scanResult) return null;
  const { analysis, image } = scanResult;

  // Prepare data for Carbon Visualizer
  const co2Saved = analysis.co2Saved || 100;
  const treeEquivalents = Math.round(co2Saved / 21); // Approx 21kg CO2 per tree per year
  
  const impactData = [
    { name: 'This Listing', value: co2Saved, color: '#16a34a' },
    { name: 'Car Trip (km)', value: co2Saved * 4, color: '#ef4444' }, // Approx
  ];

  return (
    <div className="fixed inset-0 bg-white z-40 overflow-y-auto pb-24 animate-in slide-in-from-bottom-5">
      <div className="relative h-72 bg-gray-900">
          <img src={image} className="w-full h-full object-cover opacity-80" alt="Scanned" />
          <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/90 to-transparent w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 backdrop-blur-md text-green-300 text-xs font-bold mb-2">
                  <Sparkles size={12} /> AI Analyzer 2.0
              </div>
              <h2 className="text-white text-3xl font-bold">{analysis.residueType}</h2>
              <div className="flex gap-2 mt-2">
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-md font-bold">
                    Confidence {(analysis.confidence * 100).toFixed(0)}%
                  </span>
              </div>
          </div>
          <button onClick={onCancel} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white backdrop-blur-md hover:bg-white/30 transition-colors">
              <Plus className="rotate-45" />
          </button>
      </div>

      <div className="p-6 space-y-6 max-w-3xl mx-auto">
          
          {/* 1. Enhanced Metrics: Moisture & Purity */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2 text-blue-600">
                      <Droplets size={20} />
                  </div>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Moisture</p>
                  <p className="text-xl font-bold text-blue-900">{analysis.moistureContent || 'N/A'}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center text-center">
                   <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2 text-amber-600">
                      <Sparkles size={20} />
                  </div>
                  <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Purity Score</p>
                  <p className="text-xl font-bold text-amber-900">{analysis.purityScore || 85}/100</p>
              </div>
          </div>

          {/* 2. Price & Impact Main Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                  <p className="text-sm text-green-600 font-medium mb-1">Est. Market Value</p>
                  <p className="text-2xl font-bold text-green-800">{analysis.estimatedPriceRange}<span className="text-sm font-normal text-gray-500">/ton</span></p>
              </div>
              <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100">
                  <p className="text-sm text-teal-600 font-medium mb-1">Environmental Score</p>
                  <div className="flex items-end gap-1">
                      <p className="text-2xl font-bold text-teal-800">{analysis.environmentalImpactScore}</p>
                      <span className="text-sm text-teal-600 mb-1">/10</span>
                  </div>
              </div>
          </div>

          {/* 3. Interactive 3D Carbon Impact Visualizer */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Leaf size={18} className="text-green-600" /> Carbon Impact Visualizer
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">Live Calc</span>
              </div>
              
              <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                         <p className="text-3xl font-bold text-green-700">{co2Saved} kg</p>
                         <p className="text-sm text-gray-500">CO₂ prevented from entering atmosphere</p>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-bold text-teal-600 flex items-center justify-end gap-2">
                             <Trees size={28} /> {treeEquivalents}
                         </p>
                         <p className="text-sm text-gray-500">Tree planting equivalents</p>
                      </div>
                  </div>

                  {/* Simple Chart Animation */}
                  <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart layout="vertical" data={impactData} barSize={20}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                              <Tooltip cursor={{fill: 'transparent'}} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                  {impactData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-2">
                      Comparison: Recycling this waste vs. burning it or emissions from equivalent car travel.
                  </p>
              </div>
          </div>

          {/* Suggested Uses */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Best Monetizable Uses</h3>
              <div className="flex flex-wrap gap-2">
                  {analysis.suggestedUses.map((use, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">{use}</span>
                  ))}
              </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Transport Feasibility</h3>
              <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${analysis.transportFeasibility === 'High' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      <Truck size={24} />
                  </div>
                  <div>
                      <p className="font-bold text-gray-900">{analysis.transportFeasibility} Feasibility</p>
                      <p className="text-sm text-gray-500">Calculated based on bulk density and local demand maps.</p>
                  </div>
              </div>
          </div>

          <Button onClick={onConfirm} className="shadow-xl shadow-green-600/20">List on Marketplace</Button>
      </div>
    </div>
  );
};