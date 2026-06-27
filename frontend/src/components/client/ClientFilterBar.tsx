import React from 'react';
import { Search } from 'lucide-react';

interface ClientFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedFoodType: string;
  setSelectedFoodType: (val: string) => void;
  foodTypes: string[];
}

export default function ClientFilterBar({
  searchQuery,
  setSearchQuery,
  selectedFoodType,
  setSelectedFoodType,
  foodTypes,
}: ClientFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        {foodTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedFoodType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
              selectedFoodType === type
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
