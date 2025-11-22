import React, { useState, useRef } from 'react';
import { User, Degradability, Listing, ListingStatus } from '../utils/types';
import { Button } from '../components/Common/Button';
import { Trash2, Leaf, Upload, X, Camera, CheckCircle, History, Home } from 'lucide-react';

interface HouseholdScreenProps {
  user: User;
  onSubmitWaste: (listing: Listing) => void;
  listings: Listing[];
}

export const HouseholdScreen: React.FC<HouseholdScreenProps> = ({ user, onSubmitWaste, listings }) => {
  const [degradability, setDegradability] = useState<Degradability | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myContributions = listings.filter(l => l.farmerName === user.name && l.wasteCategory === 'HOUSEHOLD_WASTE');

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

  const handleSubmit = () => {
      if (!degradability || !image || !weight || !address) return;

      setIsSubmitting(true);
      
      // Create a simplified Listing object for household waste
      const newListing: Listing = {
          id: Math.random().toString(36).substr(2, 9),
          farmerName: user.name,
          image: image,
          analysis: {
              residueType: degradability === 'DEGRADABLE' ? 'Organic Household Waste' : 'Non-Degradable Waste',
              suggestedUses: degradability === 'DEGRADABLE' ? ['Biogas Production', 'Composting'] : ['Recycling', 'Landfill'],
              transportFeasibility: 'High',
              environmentalImpactScore: degradability === 'DEGRADABLE' ? 8 : 2,
              estimatedPriceRange: 'Free Collection',
              confidence: 1
          },
          quantity: parseFloat(weight),
          location: address,
          status: ListingStatus.OPEN,
          timestamp: Date.now(),
          bids: [],
          wasteCategory: 'HOUSEHOLD_WASTE',
          degradability: degradability
      };

      setTimeout(() => {
          onSubmitWaste(newListing);
          setIsSubmitting(false);
          // Reset form
          setDegradability(null);
          setImage(null);
          setWeight('');
          setAddress('');
          alert("Waste submitted for collection!");
      }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="bg-orange-500 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Home size={32} /> Household Waste
                </h1>
                <p className="text-orange-100 mt-2 text-lg opacity-90">
                    Segregate your waste, contribute to Biogas production, and keep your city clean.
                </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm text-center min-w-[150px]">
                <p className="text-sm font-medium text-orange-100">My Impact</p>
                <p className="text-3xl font-bold">{myContributions.length} <span className="text-sm font-normal">bags</span></p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Submission Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Submit Waste</h2>

                {/* Step 1: Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">Select Waste Type</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setDegradability('DEGRADABLE')}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${degradability === 'DEGRADABLE' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300 text-gray-600'}`}
                        >
                            <Leaf size={24} className={degradability === 'DEGRADABLE' ? 'text-green-600' : 'text-gray-400'} />
                            <span className="font-bold">Degradable</span>
                            <span className="text-xs text-gray-400 text-center">Food scraps, peels, organic matter</span>
                        </button>
                        <button 
                            onClick={() => setDegradability('NON_DEGRADABLE')}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${degradability === 'NON_DEGRADABLE' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300 text-gray-600'}`}
                        >
                            <Trash2 size={24} className={degradability === 'NON_DEGRADABLE' ? 'text-red-600' : 'text-gray-400'} />
                            <span className="font-bold">Non-Degradable</span>
                            <span className="text-xs text-gray-400 text-center">Plastics, metals, glass</span>
                        </button>
                    </div>
                </div>

                {/* Step 2: Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">Upload Photo</label>
                    {!image ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Camera className="text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-500">Tap to take picture</p>
                        </div>
                    ) : (
                        <div className="relative h-40 rounded-2xl overflow-hidden">
                            <img src={image} className="w-full h-full object-cover" alt="Waste" />
                            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                                <X size={16} />
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
                </div>

                {/* Step 3: Details */}
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Approx. Weight (kg)</label>
                        <input 
                            type="number" 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g., 2.5"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Pickup Address</label>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Enter your location"
                        />
                     </div>
                </div>

                <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!degradability || !image || !weight || !address} variant="secondary" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Submit for Collection
                </Button>
            </div>

            {/* History Side */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <History size={20} className="text-gray-400" /> Recent Contributions
                    </h2>
                    
                    {myContributions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Leaf size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No contributions yet.</p>
                            <p className="text-sm">Submit waste to see it here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {myContributions.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-white" alt="waste" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800">
                                                {item.degradability === 'DEGRADABLE' ? 'Degradable Waste' : 'Non-Degradable'}
                                            </h4>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                                item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {item.status === 'COMPLETED' ? 'Collected' : 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.quantity} kg • {new Date(item.timestamp).toLocaleDateString()}</p>
                                        {item.degradability === 'DEGRADABLE' && (
                                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                                <CheckCircle size={12} /> Suitable for Biogas
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};