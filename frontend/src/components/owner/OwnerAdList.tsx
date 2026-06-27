import React from 'react';
import { Ad } from '../../types';
import { Sparkles, ToggleRight, ToggleLeft } from 'lucide-react';

interface OwnerAdListProps {
  adList: Ad[];
  onToggleAd: (adId: number) => Promise<void>;
}

export default function OwnerAdList({ adList, onToggleAd }: OwnerAdListProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        Historial de Campañas
      </h3>
      
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
        {adList.length > 0 ? (
          adList.map((ad) => (
            <div
              key={ad.id}
              className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-800"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-white truncate leading-snug">{ad.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Creado: {new Date(ad.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleAd(ad.id)}
                className="text-slate-400 hover:text-white shrink-0"
              >
                {ad.isActive ? (
                  <ToggleRight className="w-8 h-8 text-indigo-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-700" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No has creado ninguna campaña.
          </div>
        )}
      </div>
    </div>
  );
}
