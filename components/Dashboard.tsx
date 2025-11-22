import React from 'react';
import { User, Listing, UserRole } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Leaf, TrendingUp, Coins, ShoppingBag, Truck } from 'lucide-react';

interface DashboardProps {
  user: User;
  listings: Listing[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, listings }) => {
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
    <div className="space-y-6 pb-24">
      {/* Header Stats */}
      <header className={`rounded-3xl p-6 text-white shadow-lg ${isFarmer ? 'bg-gradient-to-r from-green-700 to-emerald-600' : 'bg-gradient-to-r from-blue-700 to-indigo-600'}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-white/90 opacity-90">{isFarmer ? 'Level 5 Sustainable Farmer' : 'Verified Biomass Buyer'}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Trophy size={24} className="text-yellow-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Leaf size={16} className="text-green-300" />
              <span className="text-sm font-medium opacity-80">{isFarmer ? 'Carbon Saved' : 'Green Credits'}</span>
            </div>
            <p className="text-2xl font-bold">{user.carbonPoints} {isFarmer ? 'kg' : 'pts'}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Coins size={16} className="text-yellow-300" />
              <span className="text-sm font-medium opacity-80">{isFarmer ? 'Earnings' : 'Wallet'}</span>
            </div>
            <p className="text-2xl font-bold">₹{user.walletBalance.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Rewards/Actions Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">{isFarmer ? 'Rewards Unlocked' : 'Procurement Perks'}</h2>
        <div className="flex gap-4 overflow-x-auto px-2 pb-2">
            {isFarmer ? (
                [
                    { title: 'Seeds 10% Off', icon: <SproutIcon />, color: 'bg-green-100 text-green-700' },
                    { title: 'Tool Rental', icon: <ToolIcon />, color: 'bg-orange-100 text-orange-700' },
                    { title: 'Fertilizer', icon: <LeafIcon />, color: 'bg-blue-100 text-blue-700' },
                ].map((reward, idx) => (
                    <div key={idx} className="min-w-[140px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full ${reward.color} flex items-center justify-center mb-2`}>
                            {reward.icon}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{reward.title}</span>
                    </div>
                ))
            ) : (
                [
                    { title: 'Bulk Transport', icon: <Truck size={20} />, color: 'bg-indigo-100 text-indigo-700' },
                    { title: 'Tax Credits', icon: <LeafIcon />, color: 'bg-green-100 text-green-700' },
                    { title: 'Analytics', icon: <TrendingUp size={20} />, color: 'bg-purple-100 text-purple-700' },
                ].map((reward, idx) => (
                    <div key={idx} className="min-w-[140px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full ${reward.color} flex items-center justify-center mb-2`}>
                            {reward.icon}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{reward.title}</span>
                    </div>
                ))
            )}
        </div>
      </section>

      {/* CO2 Impact Chart */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mx-2">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">{isFarmer ? 'CO2 Impact Trend' : 'Sourcing Volume'}</h2>
            <TrendingUp size={20} className={isFarmer ? 'text-green-500' : 'text-blue-500'}/>
        </div>
        <div className="h-48 w-full">
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

      {/* Activity Log */}
      <section className="px-2">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
            {recentActivity.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>
            ) : (
                recentActivity.map((listing) => (
                    <div key={listing.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={listing.image} className="w-full h-full object-cover" alt="Waste" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{listing.analysis.residueType}</h4>
                            <p className="text-xs text-gray-500">{new Date(listing.timestamp).toLocaleDateString()} • {listing.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            listing.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                            listing.status === 'PENDING_PICKUP' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {listing.status === 'COMPLETED' ? 'Done' : listing.status.replace('_', ' ')}
                        </span>
                    </div>
                ))
            )}
        </div>
      </section>
    </div>
  );
};

const SproutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>;
const ToolIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const LeafIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;