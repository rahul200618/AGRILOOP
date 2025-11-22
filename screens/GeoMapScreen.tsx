import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Globe, Sprout, Layers, CloudSun, BarChart3, ArrowLeft } from 'lucide-react';
import { AnimatedContent } from '../components/Common/AnimatedContent';
import { Tooltip } from 'react-tooltip';

// Using a stable public TopoJSON for India
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

const STATE_DATA: Record<string, any> = {
  "Punjab": {
    id: "PB",
    topCrops: ["Wheat", "Rice (Paddy)", "Maize"],
    soil: ["Alluvial Soil", "Loamy Sand"],
    residue: "Very High (22M Tons)",
    cycles: ["Kharif: Rice (Jun-Oct)", "Rabi: Wheat (Nov-Apr)"],
    districts: [
       { name: "Ludhiana", residue: "Very High", crop: "Wheat/Rice" },
       { name: "Sangrur", residue: "Very High", crop: "Paddy" },
       { name: "Patiala", residue: "High", crop: "Wheat" },
       { name: "Bhatinda", residue: "High", crop: "Cotton" }
    ]
  },
  "Haryana": {
    id: "HR",
    topCrops: ["Wheat", "Rice", "Cotton"],
    soil: ["Alluvial", "Sandy Loam"],
    residue: "High (15M Tons)",
    cycles: ["Kharif: Rice", "Rabi: Wheat"],
     districts: [
       { name: "Karnal", residue: "High", crop: "Rice" },
       { name: "Sirsa", residue: "Medium", crop: "Cotton" },
       { name: "Hisar", residue: "Medium", crop: "Wheat" }
    ]
  },
  "Uttar Pradesh": {
    id: "UP",
    topCrops: ["Sugarcane", "Wheat", "Potato"],
    soil: ["Alluvial", "Loam"],
    residue: "Very High (40M Tons)",
    cycles: ["Kharif: Paddy", "Rabi: Wheat"],
    districts: [
       { name: "Meerut", residue: "High", crop: "Sugarcane" },
       { name: "Agra", residue: "Medium", crop: "Potato" },
       { name: "Muzaffarnagar", residue: "Very High", crop: "Sugarcane" }
    ]
  },
  "Madhya Pradesh": {
    id: "MP",
    topCrops: ["Soybean", "Wheat", "Gram"],
    soil: ["Black Soil", "Clay"],
    residue: "Medium (30M Tons)",
    cycles: ["Kharif: Soybean", "Rabi: Wheat"],
    districts: [
       { name: "Indore", residue: "High", crop: "Soybean" },
       { name: "Bhopal", residue: "Medium", crop: "Wheat" },
       { name: "Ujjain", residue: "Medium", crop: "Soybean" }
    ]
  },
  "Maharashtra": {
    id: "MH",
    topCrops: ["Cotton", "Sugarcane", "Soybean"],
    soil: ["Black Cotton Soil"],
    residue: "Medium (28M Tons)",
    cycles: ["Kharif: Cotton", "Annual: Sugarcane"],
    districts: [
       { name: "Nagpur", residue: "High", crop: "Cotton" },
       { name: "Nashik", residue: "Low", crop: "Grapes" },
       { name: "Pune", residue: "Medium", crop: "Sugarcane" }
    ]
  },
  "Rajasthan": {
    id: "RJ",
    topCrops: ["Mustard", "Bajra", "Wheat"],
    soil: ["Desert", "Sandy"],
    residue: "Low (12M Tons)",
    cycles: ["Kharif: Bajra", "Rabi: Mustard"],
    districts: [
       { name: "Jaipur", residue: "Medium", crop: "Mustard" },
       { name: "Ganganagar", residue: "High", crop: "Wheat" }
    ]
  }
};

export const GeoMapScreen: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  // Simple Zoom State
  const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 4 });

  const handleStateClick = (geo: any) => {
    const stateName = geo.properties.NAME_1 || geo.properties.name;
    if (STATE_DATA[stateName]) {
      setSelectedState(stateName);
      // Simulate Zoom In
      setPosition({ coordinates: [78.9629, 22.5937], zoom: 6 }); 
    } else {
      // Fallback for other states
      setSelectedState(stateName);
      setPosition({ coordinates: [78.9629, 22.5937], zoom: 5 });
    }
  };

  const handleReset = () => {
    setSelectedState(null);
    setPosition({ coordinates: [78.9629, 22.5937], zoom: 4 });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-900 text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* LEFT: MAP AREA */}
      <div className="flex-1 relative bg-slate-950 border-r border-slate-800">
         {/* Header Overlay */}
         <div className="absolute top-4 left-4 z-10 pointer-events-none">
             <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-4 py-1.5 rounded-full text-green-300 text-sm font-bold mb-2 backdrop-blur-md">
                <Globe size={16} /> Agri-Intelligence
             </div>
             <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                India Geo-Map
             </h1>
             <p className="text-slate-400 text-xs max-w-xs mt-1">
               Click on a state to analyze crop residue clusters, soil profile, and seasonal cycles.
             </p>
         </div>

         <div className="w-full h-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1000,
                center: [78.9629, 22.5937]
              }}
              style={{ width: "100%", height: "100%" }}
            >
                <ZoomableGroup 
                    zoom={position.zoom} 
                    center={position.coordinates as [number, number]}
                    onMoveEnd={(pos) => setPosition(pos)}
                    minZoom={3}
                    maxZoom={10}
                >
                  <Geographies geography={INDIA_TOPO_JSON}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const stateName = geo.properties.NAME_1 || geo.properties.name;
                        const isSelected = selectedState === stateName;
                        const hasData = STATE_DATA[stateName];

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleStateClick(geo)}
                            data-tooltip-id="map-tooltip"
                            data-tooltip-content={`${stateName} ${hasData ? '• Click to View' : ''}`}
                            style={{
                              default: {
                                fill: isSelected ? "#16a34a" : (hasData ? "#334155" : "#1e293b"),
                                stroke: "#64748b",
                                strokeWidth: 0.5,
                                outline: "none",
                                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                              },
                              hover: {
                                fill: "#22c55e", // Bright green on hover
                                stroke: "#fff",
                                strokeWidth: 1.5,
                                outline: "none",
                                cursor: "pointer",
                                filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))" // Glow effect
                              },
                              pressed: {
                                fill: "#15803d",
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <Tooltip 
                id="map-tooltip" 
                style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    padding: '8px 12px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)'
                }} 
            />
         </div>

         {/* Controls */}
         <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button onClick={() => setPosition(p => ({...p, zoom: p.zoom + 1}))} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 shadow-lg font-bold text-xl">+</button>
            <button onClick={() => setPosition(p => ({...p, zoom: Math.max(2, p.zoom - 1)}))} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 shadow-lg font-bold text-xl">-</button>
            <button onClick={handleReset} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 shadow-lg" title="Reset View">
                <ArrowLeft size={18} />
            </button>
         </div>

         {/* Legend */}
         <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 pointer-events-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Data Layers</p>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-3 h-3 bg-slate-700 rounded-sm border border-slate-600"></span> Low Activity
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                  <span className="w-3 h-3 bg-slate-600 rounded-sm border border-slate-500"></span> High Activity
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400 font-bold mt-1">
                  <span className="w-3 h-3 bg-green-600 rounded-sm shadow-[0_0_8px_rgba(22,163,74,0.6)]"></span> Active/Selected
              </div>
         </div>
      </div>

      {/* RIGHT: INTELLIGENCE PANEL */}
      <div className={`w-full lg:w-[400px] bg-slate-900 border-l border-slate-800 overflow-y-auto custom-scrollbar transition-all duration-500 ${selectedState ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-50 lg:translate-x-0 lg:opacity-100'}`}>
        
        {selectedState && STATE_DATA[selectedState] ? (
            <AnimatedContent key={selectedState} direction="horizontal" distance={20}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-3xl font-bold text-white">{selectedState}</h2>
                         <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                            ID: {STATE_DATA[selectedState].id}
                         </span>
                    </div>

                    {/* Key Stat */}
                    <div className="bg-gradient-to-r from-green-900/40 to-slate-800 p-5 rounded-2xl border border-green-500/20 mb-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-wide mb-1">
                                <Sprout size={16} /> Crop Residue
                            </div>
                            <p className="text-2xl font-bold text-white">{STATE_DATA[selectedState].residue}</p>
                            <p className="text-xs text-slate-400 mt-1">Estimated annual biomass availability</p>
                        </div>
                        <div className="absolute right-0 bottom-0 p-4 opacity-10">
                             <BarChart3 size={64} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Top Crops */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Sprout size={14}/> Dominant Crops
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {STATE_DATA[selectedState].topCrops.map((crop: string, i: number) => (
                                    <span key={i} className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Soil Profile */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Layers size={14}/> Soil Type
                            </h3>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-slate-200 text-sm font-medium">{STATE_DATA[selectedState].soil.join(", ")}</p>
                            </div>
                        </div>

                         {/* Crop Cycles */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CloudSun size={14}/> Seasonal Cycles
                            </h3>
                            <div className="space-y-2">
                                {STATE_DATA[selectedState].cycles.map((cycle: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300 text-sm bg-slate-800/30 p-2 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span>
                                        {cycle}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* District Breakdown Table */}
                        <div className="pt-4 border-t border-slate-800 mt-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">District-Level Insights</h3>
                            <div className="space-y-2">
                                {STATE_DATA[selectedState].districts.map((dist: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-green-500/30 transition-colors">
                                        <div>
                                            <p className="font-bold text-white text-sm">{dist.name}</p>
                                            <p className="text-[10px] text-slate-400">{dist.crop}</p>
                                        </div>
                                        <div className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                                            dist.residue === 'Very High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                            dist.residue === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                            {dist.residue}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        ) : (
             // Empty State
             <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse border border-slate-700">
                    <Globe size={40} className="text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Waiting for Input...</h2>
                <p className="text-slate-400 text-sm max-w-xs">
                    Select a state from the map to generate a detailed agricultural report.
                </p>
             </div>
        )}
      </div>
    </div>
  );
};