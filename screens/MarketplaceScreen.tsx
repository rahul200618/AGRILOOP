import React, { useState } from 'react';
import { Listing, User, ListingStatus, Bid, UserRole } from '../utils/types';
import { Button } from '../components/Common/Button';
import { ShoppingBag, Truck, CheckCircle, Filter, MapPin, Clock, Search, SlidersHorizontal } from 'lucide-react';

interface MarketplaceScreenProps {
  user: User;
  listings: Listing[];
  onAcceptBid: (listingId: string, bidId: string) => void;
  onConfirmPickup: (listingId: string) => void;
  onPlaceBid: (listingId: string, amount: number, time: string) => void;
  onScanRequest: () => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ 
  user, listings, onAcceptBid, onConfirmPickup, onPlaceBid, onScanRequest 
}) => {
  const [buyerTab, setBuyerTab] = useState<'browse' | 'orders'>('browse');
  const [listingToBid, setListingToBid] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidTime, setBidTime] = useState('');

  const handleSubmitBid = () => {
      if (listingToBid && bidAmount && bidTime) {
          onPlaceBid(listingToBid.id, parseFloat(bidAmount), bidTime);
          setListingToBid(null);
          setBidAmount('');
          setBidTime('');
          setBuyerTab('orders');
      }
  };

  const renderBidModal = () => {
      if (!listingToBid) return null;
      return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl slide-in-from-bottom-10 relative">
                  <button onClick={() => setListingToBid(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Place Your Bid</h3>
                  <div className="space-y-5">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Selected Listing</label>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                              <img src={listingToBid.image} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                              <div>
                                  <p className="font-bold text-gray-900">{listingToBid.analysis.residueType}</p>
                                  <p className="text-sm text-gray-500">{listingToBid.quantity} tons • {listingToBid.location}</p>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount (₹/ton)</label>
                          <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400 font-bold">₹</span>
                              <input 
                                type="number" 
                                value={bidAmount} 
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="Enter your offer"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Pickup Time</label>
                          <div className="relative">
                              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                value={bidTime}
                                onChange={(e) => setBidTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="e.g. Tomorrow 2 PM"
                              />
                          </div>
                      </div>
                      <div className="flex gap-3 mt-8">
                          <Button variant="outline" onClick={() => setListingToBid(null)}>Cancel</Button>
                          <Button onClick={handleSubmitBid}>Confirm Bid</Button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- Farmer View ---
  if (user.role === UserRole.FARMER) {
      const myListings = listings.filter(l => l.farmerName === user.name);
      
      if (myListings.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 animate-in fade-in">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Listings Yet</h3>
                  <p className="text-gray-500 max-w-md mb-8">Scan your crop waste to create a listing. Once listed, verified buyers can place bids on your biomass.</p>
                  <Button onClick={onScanRequest} className="max-w-xs">Start Scanning</Button>
              </div>
          );
      }

      return (
          <div className="space-y-6 pb-24 md:pb-0 animate-in fade-in">
              <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
                  <Button onClick={onScanRequest} className="w-auto px-6 py-2 hidden md:flex">Create New Listing</Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                      <div className="flex h-40 sm:h-48 relative">
                          <img src={listing.image} className="w-40 sm:w-48 object-cover" alt="waste" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                             {listing.quantity} Tons
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                              <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-xl text-gray-900">{listing.analysis.residueType}</h3>
                                    <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                                        listing.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                        listing.status === 'PENDING_PICKUP' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {listing.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                      <MapPin size={14}/> {listing.location}
                                  </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Est. Market Price</p>
                                <p className="font-bold text-green-700 text-lg">{listing.analysis.estimatedPriceRange}</p>
                              </div>
                          </div>
                      </div>
                      
                      {listing.status === 'OPEN' && listing.bids.length > 0 && (
                          <div className="bg-gray-50 p-5 border-t border-gray-100 flex-1">
                              <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Active Bids ({listing.bids.length})</p>
                              <div className="space-y-3">
                                  {listing.bids.map(bid => (
                                      <div key={bid.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
                                          <div>
                                              <p className="font-bold text-gray-800">{bid.buyerName}</p>
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">★ {bid.buyerReliabilityScore}</span>
                                                <span className="text-xs text-gray-500">{bid.pickupTime}</span>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                              <span className="font-bold text-green-700 text-lg">₹{bid.amount}</span>
                                              <button 
                                                onClick={() => onAcceptBid(listing.id, bid.id)}
                                                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                              >
                                                Accept
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {listing.status === 'PENDING_PICKUP' && (
                          <div className="bg-amber-50 p-5 border-t border-amber-100 flex-1">
                              <div className="flex items-start gap-4">
                                  <div className="bg-amber-100 p-3 rounded-full">
                                      <Truck className="text-amber-600" size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-amber-900 text-lg">Pickup Scheduled</h4>
                                      <p className="text-sm text-amber-800 mt-1 mb-4">Buyer is en route. Please ensure the waste is accessible. Verify pickup with GPS proof to release funds.</p>
                                      <button 
                                        onClick={() => onConfirmPickup(listing.id)}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold shadow-md transition-colors"
                                      >
                                          Confirm Pickup & Release Payment
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      {listing.status === 'COMPLETED' && (
                           <div className="bg-green-50 p-4 border-t border-green-100 flex items-center justify-center gap-2 text-green-800 font-medium">
                              <CheckCircle size={20} /> Transaction Successfully Completed
                          </div>
                      )}
                  </div>
                ))}
              </div>
          </div>
      );
  }

  // --- Buyer View ---
  const browseListings = listings.filter(l => l.status === ListingStatus.OPEN);
  const myOrders = listings.filter(l => l.bids.some(b => b.buyerName === user.name));

  return (
      <div className="space-y-6 pb-24 md:pb-0 animate-in fade-in">
          {/* Desktop Toggle & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
                  <button 
                    onClick={() => setBuyerTab('browse')}
                    className={`flex-1 md:w-40 py-2.5 rounded-lg text-sm font-bold transition-all ${buyerTab === 'browse' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      Browse Biomass
                  </button>
                  <button 
                    onClick={() => setBuyerTab('orders')}
                    className={`flex-1 md:w-40 py-2.5 rounded-lg text-sm font-bold transition-all ${buyerTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      My Bids & Orders
                  </button>
              </div>

              {buyerTab === 'browse' && (
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input type="text" placeholder="Search crop type..." className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                        <SlidersHorizontal size={20}/>
                    </button>
                </div>
              )}
          </div>

          {buyerTab === 'browse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {browseListings.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                         <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="text-gray-400" size={32} />
                         </div>
                        <h3 className="text-xl font-bold text-gray-600">No listings found</h3>
                        <p className="text-gray-400">Try adjusting your filters or check back later.</p>
                    </div>
                ) : (
                    browseListings.map(listing => (
                        <div key={listing.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img src={listing.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="waste" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-green-700 shadow-sm">
                                    {listing.quantity} Tons
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                                    <MapPin size={12} /> {listing.location}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{listing.analysis.residueType}</h3>
                                        <p className="text-sm text-gray-500">Farmer: {listing.farmerName}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {listing.analysis.suggestedUses.slice(0, 2).map((use, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">{use}</span>
                                    ))}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Est. Price</p>
                                        <p className="font-bold text-green-700 text-lg">{listing.analysis.estimatedPriceRange}</p>
                                    </div>
                                    <Button 
                                        onClick={() => setListingToBid(listing)}
                                        className="w-auto px-4 py-2 text-sm"
                                    >
                                        Place Bid
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          )}

          {buyerTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myOrders.length === 0 ? (
                      <div className="col-span-full text-center py-20">
                        <p className="text-gray-500">You haven't placed any bids yet.</p>
                      </div>
                  ) : (
                      myOrders.map(listing => {
                          const myBid = listing.bids.find(b => b.buyerName === user.name);
                          const isAccepted = listing.acceptedBidId === myBid?.id;
                          
                          return (
                              <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative overflow-hidden">
                                  {isAccepted && (
                                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                          <div className="bg-green-500 text-white text-xs font-bold py-1 text-center transform rotate-45 translate-x-4 translate-y-3 w-24 shadow-md">
                                              WON
                                          </div>
                                      </div>
                                  )}
                                  <div className="flex gap-4 mb-4">
                                      <img src={listing.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt="waste" />
                                      <div>
                                          <h3 className="font-bold text-gray-900 text-lg">{listing.analysis.residueType}</h3>
                                          <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> {listing.location}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                                  isAccepted ? 'bg-green-100 text-green-700' : 
                                                  listing.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                                                  'bg-yellow-100 text-yellow-700'
                                              }`}>
                                                  {isAccepted ? 'Bid Accepted' : listing.status === 'COMPLETED' ? 'Completed' : 'Bid Placed'}
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                                      <div>
                                          <p className="text-xs text-gray-500 uppercase font-semibold">Your Bid</p>
                                          <p className="font-bold text-gray-800 text-lg">₹{myBid?.amount}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-xs text-gray-500 uppercase font-semibold">Pickup</p>
                                          <p className="font-medium text-gray-800 text-sm">{myBid?.pickupTime}</p>
                                      </div>
                                  </div>

                                  {isAccepted && listing.status !== 'COMPLETED' && (
                                      <div className="mt-4 pt-4 border-t border-gray-100">
                                          <p className="text-sm text-green-700 flex items-center gap-2 mb-3 font-medium">
                                              <CheckCircle size={16} /> Pickup Approved by Farmer
                                          </p>
                                          <Button variant="outline" className="w-full text-sm">View Navigation & Contact</Button>
                                      </div>
                                  )}
                              </div>
                          );
                      })
                  )}
              </div>
          )}
          {renderBidModal()}
      </div>
  );
};