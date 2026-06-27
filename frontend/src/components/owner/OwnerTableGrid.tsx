import React from 'react';
import { Restaurant } from '../../types';
import { ToggleLeft, ToggleRight, Trash2, LayoutGrid } from 'lucide-react';

interface OwnerTableGridProps {
  restaurantData: Restaurant;
  onToggleTable: (tableId: number, currentStatus: string) => Promise<void>;
  onDeleteTable: (tableId: number) => Promise<void>;
}

export default function OwnerTableGrid({
  restaurantData,
  onToggleTable,
  onDeleteTable,
}: OwnerTableGridProps) {
  return (
    <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-brandText-title flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-brand-primary" />
          Piso de Mesas (Tiempo Real)
        </h3>
        <span className="text-xs text-brandText-subtitle bg-slate-50 px-2.5 py-1 rounded-full border border-brand-border">
          {restaurantData.tables?.filter((t) => t.status === 'AVAILABLE').length || 0} de {restaurantData.tables?.length || 0} mesas libres
        </span>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {restaurantData.tables && restaurantData.tables.length > 0 ? (
          restaurantData.tables.map((table) => {
            const isAvailable = table.status === 'AVAILABLE';
            return (
              <div
                key={table.id}
                className={`rounded-xl border relative flex flex-col overflow-hidden transition-all ${
                  isAvailable
                    ? 'bg-brand-accent/5 border-brand-accent/20 shadow-sm'
                    : 'bg-brand-error/5 border-brand-error/20 shadow-sm'
                }`}
              >
                {/* Image Preview Header */}
                <div className="w-full h-20 bg-slate-100 relative shrink-0">
                  <img
                    src={table.preview || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80'}
                    alt={`Mesa #${table.number}`}
                    className={`w-full h-full object-cover ${!isAvailable && 'grayscale'}`}
                  />
                  {/* Delete button positioned absolute over the image */}
                  <button
                    onClick={() => onDeleteTable(table.id)}
                    className="absolute top-2 right-2 p-1.5 text-white hover:text-brand-error bg-slate-900/60 hover:bg-slate-900/90 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 flex flex-col justify-between flex-grow">
                  {/* Table Header Info */}
                  <div>
                    <span className="text-sm font-extrabold text-brandText-title">Mesa {table.number}</span>
                    <span className="text-[10px] block text-brandText-disabled mt-0.5">Capacidad: {table.capacity} pers.</span>
                  </div>

                  {/* Interactive toggle block */}
                  <div className="mt-3 pt-2 border-t border-brand-border flex justify-between items-center w-full">
                    <span className={`text-[10px] font-bold ${isAvailable ? 'text-brand-accent' : 'text-brand-error'}`}>
                      {isAvailable ? 'Disponible' : 'Ocupada'}
                    </span>
                    
                    <button
                      onClick={() => onToggleTable(table.id, table.status)}
                      className="text-brandText-disabled hover:text-brand-primary transition-colors"
                    >
                      {isAvailable ? (
                        <ToggleLeft className="w-7 h-7 text-brandText-disabled cursor-pointer" />
                      ) : (
                        <ToggleRight className="w-7 h-7 text-brand-primary cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <LayoutGrid className="w-10 h-10 text-brandText-disabled mx-auto mb-3" />
            <p className="text-brandText-disabled text-xs">No hay mesas configuradas en este restaurante.</p>
          </div>
        )}
      </div>
    </div>
  );
}
