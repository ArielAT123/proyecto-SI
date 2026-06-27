import React, { useState, useEffect } from 'react';
import { Ad, Restaurant } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ClientAdBannerProps {
  activeAds: Ad[];
  restaurants: Restaurant[];
  onOpenDetail: (restaurant: Restaurant) => void;
}

export default function ClientAdBanner({ activeAds, restaurants, onOpenDetail }: ClientAdBannerProps) {
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // Auto-scroll ads banner
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAds]);

  if (activeAds.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-[16px] h-56 md:h-64 shadow-brandCard border border-brand-borderCard bg-brand-card group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${activeAdIndex * 100}%)` }}
      >
        {activeAds.map((ad) => (
          <div 
            key={ad.id} 
            className="w-full h-full flex-shrink-0 relative cursor-pointer"
            onClick={() => {
              const rest = restaurants.find(r => r.id === ad.restaurantId);
              if (rest) onOpenDetail(rest);
            }}
          >
            {/* Background Image with Overlay */}
            <img 
              src={ad.image} 
              alt={ad.title} 
              className="w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202124] via-[#202124]/30 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="bg-brand-primary/95 text-xs font-semibold px-2.5 py-1 rounded-full text-white uppercase tracking-wider w-max mb-2 backdrop-blur-sm shadow-sm">
                {ad.restaurant?.name || 'Promoción Especial'}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug max-w-2xl">
                {ad.title}
              </h3>
              <p className="text-slate-350 text-xs md:text-sm mt-1 flex items-center gap-1 group-hover:text-brand-secondary transition-colors">
                Hacer clic para reservar mesa ahora <ArrowRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {activeAds.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2 z-10">
          {activeAds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveAdIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeAdIndex === idx ? 'bg-brand-primary w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
