import React, { useState } from 'react';
import { Listing, User, Degradability } from '../utils/types';
import { Button } from '../components/Common/Button';
import { Flame, MapPin, CheckCircle, Filter, Leaf, Trash2, Search } from 'lucide-react';

interface BiogasMarketplaceScreenProps {
  user: User;
  listings: Listing[];
  onCollectWaste: (listingId: string) => void;
}

export const BiogasMarketplaceScreen: React.FC<BiogasMarketplaceScreenProps> = ({ user, listings, onCollectWaste }) => {
  const [filter, setFilter] = useState<Degradability | 'ALL'>('ALL');

  // Filter specifically for HOUSEHOLD_WASTE
  const wasteListings = listings.filter(l => 
      l.wasteCategory === 'HOUSEHOLD_WASTE' && 
      l.status === 'OPEN' &&
      (filter === 'ALL' || l.degradability === filter)
  );

  const myCollections = listings.filter(l => 
      l.wasteCategory === 'HOUSEHOLD_WASTE' && 
      l.status === 'COMPLETED' // Assuming immediate collection for this demo, or separate status
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 animate-in fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Flame size={32} className="text-purple-300" /> Biogas Procurement
                    </h1>
                    <p className="text-purple-100 mt-2 text-lg opacity-90">
                        Source organic waste from households for energy generation.
                    </p>
                </div>
                 <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm flex gap-8">
                    <div className="text-center">
                        <p className="text-sm font-medium text-purple-200">Available Lots</p>
                        <p className="text-2xl font-bold">{wasteListings.length}</p>
                    </div>
                     <div className="text-center border-l border-white/20 pl-8">
                        <p className="text-sm font-medium text-purple-200">Collected</p>
                        <p className="text-2xl font-bold">{myCollections.length}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-2 w-full md:w-auto">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'ALL' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    All Waste
                </button>
                <button 
                    onClick={() => setFilter('DEGRADABLE')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'DEGRADABLE' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Leaf size={16} /> Degradable
                </button>
                <button 
                    onClick={() => setFilter('NON_DEGRADABLE')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'NON_DEGRADABLE' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Trash2 size={16} /> Non-Degradable
                </button>
            </div>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Search location..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteListings.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No pending collections found</h3>
                    <p className="text-gray-400">Available household waste will appear here.</p>
                </div>
            ) : (
                wasteListings.map(listing => (
                    <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                        <div className="h-48 relative">
                            <img src={listing.image} className="w-full h-full object-cover" alt="waste" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                {listing.quantity} kg
                            </div>
                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-white flex items-center gap-1 ${
                                listing.degradability === 'DEGRADABLE' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {listing.degradability === 'DEGRADABLE' ? <><Leaf size={12}/> Bio-Degradable</> : <><Trash2 size={12}/> Non-Degradable</>}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 mb-1">{listing.farmerName}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                <MapPin size={14} /> {listing.location}
                            </p>
                            
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Contents</p>
                                <p className="text-sm font-medium text-gray-700">{listing.analysis.residueType}</p>
                            </div>

                            <Button 
                                onClick={() => onCollectWaste(listing.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Mark as Collected
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};