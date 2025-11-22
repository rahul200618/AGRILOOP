import React, { useState } from 'react';
import { UserRole } from '../utils/types';
import { Sprout, Briefcase, ScanLine, ArrowDown, CheckCircle2, FlaskConical, Leaf, X, BookOpen, Calculator, Home, Flame } from 'lucide-react';
import { FarmingGuideScreen } from './FarmingGuideScreen';
import Particles from '../components/Common/Particles';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

type FertilizerType = 'NATURAL' | 'CHEMICAL' | null;

interface FertilizerItem {
  name: string;
  description: string;
  suitableCrops: string[];
  icon: React.ReactNode;
}

const FERTILIZER_DATA: Record<'NATURAL' | 'CHEMICAL', FertilizerItem[]> = {
  NATURAL: [
    {
      name: 'Vermicompost',
      description: 'Nutrient-rich organic fertilizer produced by earthworms. Improves soil aeration.',
      suitableCrops: ['Tomatoes', 'Potatoes', 'Leafy Vegetables', 'Fruits'],
      icon: <Sprout className="text-green-600" />
    },
    {
      name: 'Cow Dung Manure',
      description: 'Traditional organic manure rich in nitrogen and beneficial bacteria.',
      suitableCrops: ['Wheat', 'Rice (Paddy)', 'Sugarcane', 'General Gardening'],
      icon: <Leaf className="text-green-600" />
    },
    {
      name: 'Neem Cake',
      description: 'Organic residue of neem oil production. Acts as fertilizer and pest repellent.',
      suitableCrops: ['Cotton', 'Turmeric', 'Chilli', 'Paddy'],
      icon: <CheckCircle2 className="text-green-600" />
    },
    {
      name: 'Bone Meal',
      description: 'Slow-release fertilizer rich in phosphorus and calcium.',
      suitableCrops: ['Flowering Plants', 'Root Vegetables', 'Fruit Trees'],
      icon: <Leaf className="text-green-600" />
    }
  ],
  CHEMICAL: [
    {
      name: 'Urea (Nitrogen)',
      description: 'Highly concentrated nitrogen fertilizer. Promotes rapid green leafy growth.',
      suitableCrops: ['Maize', 'Wheat', 'Rice', 'Spinach'],
      icon: <FlaskConical className="text-blue-600" />
    },
    {
      name: 'DAP',
      description: 'Provides Phosphorus and Nitrogen. Crucial for root establishment.',
      suitableCrops: ['Wheat', 'Mustard', 'Pulses', 'Potato'],
      icon: <FlaskConical className="text-blue-600" />
    },
    {
      name: 'MOP (Potash)',
      description: 'Provides Potassium. Improves disease resistance and grain quality.',
      suitableCrops: ['Coconut', 'Banana', 'Sugarcane', 'Vegetables'],
      icon: <FlaskConical className="text-blue-600" />
    },
    {
      name: 'NPK 12:32:16',
      description: 'Balanced chemical fertilizer providing all three primary nutrients.',
      suitableCrops: ['Cotton', 'Groundnut', 'Vegetables'],
      icon: <FlaskConical className="text-blue-600" />
    }
  ]
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [selectedFertType, setSelectedFertType] = useState<FertilizerType>(null);

  const handleFertilizerClose = () => {
    setShowFertilizerModal(false);
    setSelectedFertType(null);
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-900 bg-white overflow-x-hidden">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Sprout size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AgriLoop</h1>
                <p className="text-xs text-gray-500 font-medium">Circular Economy</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="cursor-target text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">Features</a>
              <a href="#roles" className="cursor-target text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">Get Started</a>
              <button onClick={() => setShowFertilizerModal(true)} className="cursor-target text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">Guide</button>
              <button onClick={() => setShowPlannerModal(true)} className="cursor-target bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg">
                Farm Planner
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* ANIMATED PARTICLES BACKGROUND */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* MODERN BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
        <Particles
          particleColors={['#22c55e', '#16a34a']}
          particleCount={50}
          particleSpread={3}
          speed={0.05}
          particleBaseSize={20}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-20">
             {/* Modern Hero Content */}
             <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-20 relative">
                
                {/* Left Content */}
                <div className="text-center lg:text-left animate-slide-up">
                   <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6 animate-scale-in">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-green-700 font-semibold text-sm">AI-Powered Circular Economy</span>
                   </div>
                   
                   <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                     Transform <br/>
                     <span className="gradient-text">Waste</span> into <br/>
                     <span className="gradient-text">Wealth</span>
                   </h1>
                   
                   <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                     Connect farmers, buyers, and households in a sustainable marketplace powered by AI waste analysis and carbon tracking.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                     <button onClick={() => onLogin(UserRole.FARMER)} className="cursor-target bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-glow">
                       Start as Farmer
                     </button>
                     <button onClick={() => setShowPlannerModal(true)} className="cursor-target bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300">
                       Try Farm Planner
                     </button>
                   </div>
                   
                   {/* Stats */}
                   <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                     <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                       <div className="text-3xl font-black text-green-600">200+</div>
                       <div className="text-sm text-gray-500 font-medium">Active Farmers</div>
                     </div>
                     <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                       <div className="text-3xl font-black text-green-600">₹50L+</div>
                       <div className="text-sm text-gray-500 font-medium">Revenue Generated</div>
                     </div>
                     <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
                       <div className="text-3xl font-black text-green-600">1000T</div>
                       <div className="text-sm text-gray-500 font-medium">CO₂ Saved</div>
                     </div>
                   </div>
                </div>
                
                {/* Right Visual */}
                <div className="relative animate-float">
                   {/* Floating Cards */}
                   <div className="bg-white p-6 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                         <ScanLine className="text-green-600" size={24} />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-gray-900">AI Scanner</div>
                         <div className="text-xs text-gray-500">Instant Analysis</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-white p-6 rounded-2xl shadow-xl animate-float mt-6" style={{ animationDelay: '1s' }}>
                     <div className="text-center">
                       <div className="text-2xl font-black text-green-600">₹3,500</div>
                       <div className="text-xs text-gray-500 font-medium">Estimated Value</div>
                     </div>
                   </div>
                </div>
             </div>
             
             {/* Scroll Indicator */}
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-float">
                <span className="text-sm font-medium text-gray-600 mb-2">Discover More</span>
                <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
                </div>
             </div>
        </section>

        {/* 2. AI FEATURE SECTION */}
        <section id="features" className="min-h-screen flex items-center glass py-20">
           <div className="max-w-6xl mx-auto w-full px-4">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 relative animate-slide-up">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full filter blur-3xl opacity-40 animate-pulse-glow"></div>
                    <div className="relative glass-dark p-4 rounded-3xl">
                      <img 
                          src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800" 
                          alt="AI Scanning" 
                          className="relative rounded-2xl shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-all duration-500 z-10 card-hover"
                      />
                      <div className="absolute inset-0 animate-shimmer rounded-3xl"></div>
                    </div>
                </div>
                <div className="order-1 md:order-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="inline-flex items-center gap-3 text-green-700 font-bold mb-6 glass p-3 rounded-full animate-pulse-glow">
                       <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                         <ScanLine size={18} className="text-white" />
                       </div>
                       <span className="gradient-text">AI Analyzer 2.0</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight text-responsive">
                       Value from <br/><span className="gradient-text animate-pulse">Waste.</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                      Our Enhanced AI 2.0 doesn't just identify crops. It detects moisture, calculates purity, and visualizes the exact carbon offset of your harvest.
                    </p>
                    <ul className="space-y-4">
                      {['Instant ₹ Price Estimation', '3D Carbon Impact Visualizer', 'Moisture & Purity Detection'].map((item, i) => (
                          <li key={i} className="flex items-center gap-4 text-lg text-gray-800 font-medium animate-slide-up card-hover p-3 rounded-xl" style={{ animationDelay: `${0.8 + i * 0.2}s` }}>
                             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg animate-pulse-glow">
                               <CheckCircle2 size={16} strokeWidth={3}/>
                             </div>
                             <span className="gradient-text font-semibold">{item}</span>
                          </li>
                      ))}
                    </ul>
                </div>
             </div>
           </div>
        </section>

        {/* 3. ROLE SELECTION */}
        <section id="roles" className="min-h-screen glass py-20 px-4 flex flex-col justify-center">
           <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 animate-slide-up">
                   <div className="inline-block mb-6">
                     <h2 className="text-4xl md:text-6xl font-black gradient-text mb-4 text-responsive">Select Your Role</h2>
                     <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full mx-auto w-32 animate-pulse"></div>
                   </div>
                   <p className="text-xl text-gray-600 font-medium">Enter the <span className="gradient-text font-bold">circular economy</span> ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                   
                   {/* 1. FARMER */}
                   <button onClick={() => onLogin(UserRole.FARMER)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-green-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <Sprout size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold gradient-text mb-3 relative z-10">Farmer</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">Scan waste, list crops, earn rewards.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                    {/* 2. BUYER */}
                   <button onClick={() => onLogin(UserRole.BUYER)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-blue-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.1s' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <Briefcase size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold gradient-text-blue mb-3 relative z-10">Buyer</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">Source biomass, track sustainable impact.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                   {/* 3. HOUSEHOLD */}
                   <button onClick={() => onLogin(UserRole.HOUSEHOLD)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-orange-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.2s' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <Home size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-orange-600 mb-3 relative z-10">Household</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">Submit segregated waste for collection.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                   {/* 4. BIOGAS */}
                   <button onClick={() => onLogin(UserRole.BIOGAS)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-purple-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.3s' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <Flame size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-purple-600 mb-3 relative z-10">Biogas Co.</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">Procure organic waste for energy.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                    {/* 5. FARM PLANNER */}
                   <button onClick={() => setShowPlannerModal(true)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-teal-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.4s' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <Calculator size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-teal-600 mb-3 relative z-10">Farm Planner</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">Calculate yield & estimated revenue.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                   {/* 6. LEARNING HUB */}
                   <button onClick={() => onLogin(UserRole.LEARNER)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-indigo-400 text-left relative overflow-hidden h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.5s' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-bl-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 opacity-20 group-hover:opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 animate-pulse-glow group-hover:scale-110 transition-transform">
                        <BookOpen size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-indigo-600 mb-3 relative z-10">Learning Hub</h3>
                      <p className="text-gray-600 text-sm relative z-10 font-medium">AI tips for Soil, Crop & Fertilizer.</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>
                   


                   {/* 8. FERTILIZER GUIDE */}
                   <button onClick={() => setShowFertilizerModal(true)} className="cursor-target group glass p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-amber-400 text-left relative overflow-hidden lg:col-span-4 h-full card-hover btn-glow animate-scale-in" style={{ animationDelay: '0.6s' }}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:scale-125 opacity-20 group-hover:opacity-30"></div>
                      <div className="flex items-center gap-8 relative z-10 h-full">
                         <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center animate-pulse-glow group-hover:scale-110 transition-transform">
                           <FlaskConical size={36} className="text-white" />
                         </div>
                         <div className="flex-1">
                            <h3 className="text-3xl font-bold text-amber-600 mb-2">Fertilizer Guide <span className="text-lg font-medium text-gray-500">(Public)</span></h3>
                            <p className="text-gray-600 font-medium">Compare Natural vs Chemical fertilizers and check crop suitability.</p>
                            <div className="mt-3 flex gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Natural</span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Chemical</span>
                            </div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                   </button>

                </div>
           </div>
        </section>

      </div>

      {/* FERTILIZER MODAL */}
      {showFertilizerModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-10">
          <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-900">Fertilizer Guide</h2>
             <button onClick={handleFertilizerClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="max-w-5xl mx-auto p-6 min-h-[80vh] flex flex-col">
             {!selectedFertType ? (
               <div className="flex-1 flex flex-col items-center justify-center py-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">Choose Fertilizer Type</h3>
                  <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl mt-8">
                     <button onClick={() => setSelectedFertType('NATURAL')} className="cursor-target bg-green-50 border-2 border-green-100 hover:border-green-500 rounded-3xl p-8 text-left hover:shadow-xl">
                        <Leaf size={32} className="text-green-600 mb-4" />
                        <h4 className="text-2xl font-bold text-green-800">Natural</h4>
                        <p className="text-green-700 mt-2">Eco-friendly, sustainable.</p>
                     </button>
                     <button onClick={() => setSelectedFertType('CHEMICAL')} className="cursor-target bg-blue-50 border-2 border-blue-100 hover:border-blue-500 rounded-3xl p-8 text-left hover:shadow-xl">
                        <FlaskConical size={32} className="text-blue-600 mb-4" />
                        <h4 className="text-2xl font-bold text-blue-800">Chemical</h4>
                        <p className="text-blue-700 mt-2">High yield, fast acting.</p>
                     </button>
                  </div>
               </div>
             ) : (
               <div>
                  <button onClick={() => setSelectedFertType(null)} className="mb-6 text-gray-500">← Back</button>
                  <div className="grid md:grid-cols-2 gap-6">
                     {FERTILIZER_DATA[selectedFertType].map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                           <div className="flex justify-between mb-2"><h4 className="text-xl font-bold">{item.name}</h4>{item.icon}</div>
                           <p className="text-gray-600 mb-4">{item.description}</p>
                           <div className="flex flex-wrap gap-2">
                               {item.suitableCrops.map((c, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{c}</span>)}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>
      )}

      {/* FARM PLANNER MODAL */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-10">
          <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Agricultural Planner</h2>
              <button onClick={() => setShowPlannerModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="max-w-3xl mx-auto py-8">
              <FarmingGuideScreen />
          </div>
        </div>
      )}
    </div>
  );
};