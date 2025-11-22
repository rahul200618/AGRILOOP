import React from 'react';
import { User, Listing, UserRole } from '../utils/types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Leaf, TrendingUp, Coins, Truck } from 'lucide-react';

interface DashboardProps {
  user: User;
  listings: Listing[];
}

export const RewardsDashboardScreen: React.FC<DashboardProps> = ({ user, listings }) => {
  const isFarmer = user.role === UserRole.FARMER;

  // Mock data for the chart based on "months"
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: user.carbonPoints > 0 ? user.carbonPoints / 5 : 100 }, // scaled for demo
  ];

  const getRecentActivity = () => {
      if (isFarmer) {
          return listings.filter(l => l.farmerName === user.name).slice(0, 3);
      } else {
          // For buyers, show listings where they have bid
          return listings.filter(l => l.bids.some(b => b.buyerName === user.name)).slice(0, 3);
      }
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-8 pb-24 md:pb-0 animate-in fade-in">
      {/* Header Stats - Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className={`md:col-span-3 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center ${isFarmer ? 'bg-gradient-to-r from-green-700 to-emerald-600' : 'bg-gradient-to-r from-blue-700 to-indigo-600'}`}>
            <div className="mb-6 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
                <p className="text-white/90 opacity-90 text-lg">{isFarmer ? 'Level 5 Sustainable Farmer' : 'Verified Biomass Buyer'}</p>
            </div>
            <div className="flex gap-6">
                 <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm min-w-[140px] text-center">
                    <div className="flex items-center justify-center gap-2 mb-1 text-green-100">
                        <Leaf size={18} />
                        <span className="text-sm font-medium">{isFarmer ? 'Carbon Saved' : 'Credits'}</span>
                    </div>
                    <p className="text-3xl font-bold">{user.carbonPoints} <span className="text-sm font-normal opacity-70">{isFarmer ? 'kg' : 'pts'}</span></p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm min-w-[140px] text-center">
                    <div className="flex items-center justify-center gap-2 mb-1 text-yellow-100">
                        <Coins size={18} />
                        <span className="text-sm font-medium">Balance</span>
                    </div>
                    <p className="text-3xl font-bold">₹{user.walletBalance.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Rewards & Activity */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* CO2 Impact Chart */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{isFarmer ? 'Carbon Reduction Impact' : 'Sustainable Sourcing Volume'}</h2>
                        <p className="text-gray-500 text-sm">Monthly trend of {isFarmer ? 'biomass recycled' : 'waste purchased'}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${isFarmer ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? (isFarmer ? '#16A34A' : '#4F46E5') : (isFarmer ? '#DCFCE7' : '#E0E7FF')} />
                            ))}
                        </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Rewards/Actions Row */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{isFarmer ? 'Available Rewards' : 'Buyer Incentives'}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {isFarmer ? (
                        [
                            { title: 'Seeds 10% Off', icon: <SproutIcon />, color: 'bg-green-100 text-green-700' },
                            { title: 'Tool Rental', icon: <ToolIcon />, color: 'bg-orange-100 text-orange-700' },
                            { title: 'Fertilizer', icon: <LeafIcon />, color: 'bg-blue-100 text-blue-700' },
                        ].map((reward, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-12 h-12 rounded-full ${reward.color} flex items-center justify-center mb-3`}>
                                    {reward.icon}
                                </div>
                                <span className="font-bold text-gray-800">{reward.title}</span>
                                <span className="text-xs text-gray-500 mt-1">Redeem with points</span>
                            </div>
                        ))
                    ) : (
                        [
                            { title: 'Bulk Transport', icon: <Truck size={24} />, color: 'bg-indigo-100 text-indigo-700' },
                            { title: 'Tax Credits', icon: <LeafIcon />, color: 'bg-green-100 text-green-700' },
                            { title: 'Market Analytics', icon: <TrendingUp size={24} />, color: 'bg-purple-100 text-purple-700' },
                        ].map((reward, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-12 h-12 rounded-full ${reward.color} flex items-center justify-center mb-3`}>
                                    {reward.icon}
                                </div>
                                <span className="font-bold text-gray-800">{reward.title}</span>
                                <span className="text-xs text-gray-500 mt-1">Premium Feature</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

          </div>

          {/* Right Column: Activity Feed */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    <button className="text-sm font-medium text-green-600 hover:text-green-700">View All</button>
                </div>
                
                <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <Trophy size={40} className="mx-auto mb-2 opacity-50" />
                            <p>No recent activity.</p>
                        </div>
                    ) : (
                        recentActivity.map((listing) => (
                            <div key={listing.id} className="group flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img src={listing.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Waste" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">{listing.analysis.residueType}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{new Date(listing.timestamp).toLocaleDateString()} • {listing.location}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            listing.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                            listing.status === 'PENDING_PICKUP' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {listing.status === 'COMPLETED' ? 'Done' : listing.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
          </div>

      </div>
    </div>
  );
};

const SproutIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>;
const ToolIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const LeafIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;