import React from 'react';
import { Ad } from '../../types';
import { Sparkles, ToggleRight, ToggleLeft } from 'lucide-react';

interface OwnerAdListProps {
  adList: Ad[];
  onToggleAd: (adId: number) => Promise<void>;
}

export default function OwnerAdList({ adList, onToggleAd }: OwnerAdListProps) {
  return (
    <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard space-y-4">
      <h3 className="text-base font-bold text-brandText-title flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-primary" />
        Historial de Campañas
      </h3>
      
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
        {adList.length > 0 ? (
          adList.map((ad) => (
            <div
              key={ad.id}
              className="p-3.5 bg-white border border-brand-border rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-brand-border"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-brandText-title truncate leading-snug">{ad.title}</h4>
                  <p className="text-[10px] text-brandText-disabled mt-0.5">
                    Creado: {new Date(ad.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleAd(ad.id)}
                className="text-brandText-disabled hover:text-brandText-subtitle shrink-0"
              >
                {ad.isActive ? (
                  <ToggleRight className="w-8 h-8 text-brand-primary" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-brandText-disabled" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-brandText-disabled text-xs">
            No has creado ninguna campaña.
          </div>
        )}
      </div>
    </div>
  );
}
