import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Leaf } from 'lucide-react';
import { Button } from '../Common/Button';
import { analyzeCropWaste } from '../../utils/ai/aiWasteAnalyzer';
import { WasteAnalysis } from '../../utils/types';

interface ScannerProps {
  onScanComplete: (image: string, analysis: WasteAnalysis) => void;
  onCancel: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCropWaste(image);
      onScanComplete(image, result);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-200">
      <div className="p-4 bg-green-600 text-white flex justify-between items-center shadow-md">
        <h2 className="text-lg font-bold">Crop Waste Scanner</h2>
        <button onClick={onCancel} className="p-2 hover:bg-green-700 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {!image ? (
          <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gray-50 mb-6">
            <div className="p-6 bg-green-100 rounded-full mb-4">
              <Camera size={48} className="text-green-600" />
            </div>
            <p className="text-gray-500 mb-6 text-center max-w-xs">Take a photo of your crop residue to identify its value.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload size={18} /> Upload
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Camera size={18} /> Camera
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="w-full mb-6 animate-fade-in">
            <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-xl mb-6">
              <img src={image} alt="Crop Scan" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                   <Leaf size={18} /> AI Analysis Ready
                </h3>
                <p className="text-sm text-blue-700">
                  AgriLoop AI will detect the residue type, calculate carbon impact, and estimate market price.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 pb-10">
        <Button 
          disabled={!image} 
          onClick={handleAnalyze} 
          isLoading={isAnalyzing}
          className="shadow-xl"
        >
          {isAnalyzing ? "Analyzing with Gemini..." : "Analyze Waste"}
        </Button>
      </div>
    </div>
  );
};