import React, { useState, useRef } from 'react';
import { Button } from '../components/Common/Button';
import { Camera, Upload, X, Sprout, FlaskConical, Mountain, BookOpen, Lightbulb, Activity } from 'lucide-react';
import { analyzeFarmInput } from '../utils/ai/aiWasteAnalyzer';
import { FarmInputAnalysis } from '../utils/types';

export const LearningHubScreen: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FarmInputAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const result = await analyzeFarmInput(image);
      setAnalysis(result);
    } catch (e) {
      alert("Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 animate-in fade-in pb-24">
      {/* Header */}
      <div className="bg-teal-600 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen size={32} /> Farmer Learning Hub
        </h1>
        <p className="text-teal-100 mt-2 text-lg opacity-90">
          Scan your Soil, Crops, or Fertilizer to get instant AI expert advice and simple explanations.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">What do you want to learn about?</h2>
        
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group"
          >
             <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Sprout size={24} />
                </div>
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform delay-75">
                   <Mountain size={24} />
                </div>
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform delay-150">
                   <FlaskConical size={24} />
                </div>
             </div>
             <p className="text-lg font-medium text-gray-600">Tap to Scan Crop, Soil, or Fertilizer</p>
             <p className="text-sm text-gray-400 mt-2">Support for Hindi & English</p>
          </div>
        ) : (
           <div className="relative h-64 rounded-3xl overflow-hidden shadow-md">
              <img src={image} className="w-full h-full object-cover" alt="Input" />
              <button 
                onClick={() => { setImage(null); setAnalysis(null); }}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
           </div>
        )}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
        />

        {image && !analysis && (
            <div className="mt-6">
                <Button onClick={handleAnalyze} isLoading={isLoading} className="bg-teal-600 hover:bg-teal-700">
                    Analyze Image
                </Button>
            </div>
        )}
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
                <div className={`p-6 text-white flex justify-between items-start ${
                    analysis.type === 'CROP' ? 'bg-green-600' : 
                    analysis.type === 'SOIL' ? 'bg-amber-700' : 
                    analysis.type === 'FERTILIZER' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1 opacity-90 text-sm font-bold uppercase tracking-wider">
                            {analysis.type === 'CROP' && <Sprout size={16} />}
                            {analysis.type === 'SOIL' && <Mountain size={16} />}
                            {analysis.type === 'FERTILIZER' && <FlaskConical size={16} />}
                            {analysis.type} DETECTED
                        </div>
                        <h2 className="text-3xl font-bold">{analysis.name}</h2>
                    </div>
                    {analysis.healthScore !== undefined && (
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-center min-w-[80px]">
                             <Activity size={20} className="mx-auto mb-1" />
                             <span className="text-xl font-bold">{analysis.healthScore}</span>
                             <span className="text-xs block opacity-80">Score</span>
                        </div>
                    )}
                </div>
                
                <div className="p-6">
                     <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {analysis.summary}
                     </p>
                     
                     <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                        <h3 className="font-bold text-teal-800 flex items-center gap-2 mb-4">
                            <Lightbulb size={20} className="text-teal-600" /> Smart Tips
                        </h3>
                        <ul className="space-y-3">
                            {analysis.tips.map((tip, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-700">
                                    <span className="w-6 h-6 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};