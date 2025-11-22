import React from 'react';
import { UserRole } from '../types';
import { Sprout, Briefcase } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600 text-white mb-4 shadow-xl">
            <Sprout size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">AgriLoop 2.0</h1>
          <p className="text-gray-600 text-lg">Turn agricultural waste into rural wealth.</p>
        </div>

        <div className="grid gap-4 mt-8">
          <button
            onClick={() => onLogin(UserRole.FARMER)}
            className="group relative flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-green-500"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Sprout size={24} />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-bold text-gray-900">I am a Farmer</h3>
              <p className="text-sm text-gray-500">Scan waste, list crop residue, earn rewards.</p>
            </div>
          </button>

          <button
            onClick={() => onLogin(UserRole.BUYER)}
            className="group relative flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-blue-500"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase size={24} />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-bold text-gray-900">I am a Buyer</h3>
              <p className="text-sm text-gray-500">Sourcing biomass for energy, compost, or feed.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};