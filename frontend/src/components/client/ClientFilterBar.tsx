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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brandText-disabled w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-brand-borderInput hover:border-brand-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-brandText-title rounded-input transition-all placeholder:text-brandText-disabled outline-none"
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
                ? 'bg-brand-primary border-brand-primary text-white shadow-brandCard'
                : 'bg-white border-brand-border text-brandText-subtitle hover:text-brand-primary hover:border-brand-primary/30'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
