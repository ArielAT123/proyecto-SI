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
      className="brand-card-style rounded-[16px] overflow-hidden cursor-pointer flex flex-col group animate-fade-in bg-white border border-brand-borderCard shadow-brandCard hover:bg-[#F8F8F8] transition-all duration-300"
    >
      {/* Photo */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={restaurant.photo}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category overlay */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brandText-title text-xs font-semibold px-3 py-1 rounded-full border border-brand-border shadow-sm">
          {restaurant.foodType}
        </span>

        {/* Real-time status indicator */}
        <div className="absolute bottom-4 right-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border ${
              hasFree
                ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/30'
                : 'bg-brand-error/20 text-brand-error border-brand-error/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${hasFree ? 'bg-brand-accent animate-pulse' : 'bg-brand-error'}`} />
            {hasFree ? `${restaurant.availableTablesCount} mesas libres` : 'Mesas agotadas'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-brandText-title group-hover:text-brand-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-brandText-body text-sm mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brandText-disabled shrink-0" />
            {restaurant.location}
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-brand-border flex justify-between items-center text-xs text-brandText-disabled">
          <span className="flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            {restaurant.tables?.length || 0} mesas en total
          </span>
          <span className="text-brand-primary font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Ver Disponibilidad <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
