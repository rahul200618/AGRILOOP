import React from 'react';
import { Sprout, Globe2, Recycle } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24 animate-in fade-in">
      <div className="bg-green-600 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sprout size={32} />
          About AgriLoop 2.0
        </h1>
        <p className="text-green-100 mt-3 text-lg opacity-90">
          AgriLoop 2.0 is a digital platform that converts agricultural and household waste
          into new value by connecting farmers, households, and bio-energy buyers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
            <Recycle size={22} />
          </div>
          <h2 className="font-semibold text-lg text-gray-900">Why AgriLoop?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Crop residue burning and unmanaged organic waste create serious air pollution
            and climate impact. AgriLoop helps turn that waste into income and clean energy
            instead of smoke.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Globe2 size={22} />
          </div>
          <h2 className="font-semibold text-lg text-gray-900">Who is it for?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Farmers, households, and biogas / biofuel plants. Farmers and households can
            list their waste, while buyers can discover quality-assured feedstock nearby.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center">
            <Sprout size={22} />
          </div>
          <h2 className="font-semibold text-lg text-gray-900">What can you do?</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Scan waste and create instant marketplace listings</li>
            <li>Track carbon points and rewards for green actions</li>
            <li>Access learning content for climate-smart farming</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-lg text-gray-900 mb-2">Vision</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Our vision is to build a circular bioeconomy where every kilogram of agricultural
          or household organic waste is traceable, fairly priced, and converted into
          productive value—benefiting farmers, rural communities, and the climate.
        </p>
      </div>
    </div>
  );
};
