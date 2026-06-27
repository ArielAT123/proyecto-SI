import React from 'react';
import { Restaurant } from '../../types';
import { MapPin, Utensils, ArrowRight } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onOpenDetail: (restaurant: Restaurant) => void;
}

export default function RestaurantCard({ restaurant, onOpenDetail }: RestaurantCardProps) {
  const hasFree = (restaurant.availableTablesCount || 0) > 0;

  return (
    <div
      onClick={() => onOpenDetail(restaurant)}
      className="glassmorphism-card rounded-2xl overflow-hidden cursor-pointer flex flex-col group animate-fade-in"
    >
      {/* Photo */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={restaurant.photo}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category overlay */}
        <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-880">
          {restaurant.foodType}
        </span>

        {/* Real-time status indicator */}
        <div className="absolute bottom-4 right-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border ${
              hasFree
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${hasFree ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {hasFree ? `${restaurant.availableTablesCount} mesas libres` : 'Mesas agotadas'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            {restaurant.location}
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            {restaurant.tables?.length || 0} mesas en total
          </span>
          <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Ver Disponibilidad <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
