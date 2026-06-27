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
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-indigo-400" />
          Piso de Mesas (Tiempo Real)
        </h3>
        <span className="text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-850">
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
                className={`p-4 rounded-xl border relative flex flex-col justify-between h-36 transition-all ${
                  isAvailable
                    ? 'bg-slate-950/60 border-emerald-500/20 shadow-lg shadow-emerald-950/10'
                    : 'bg-slate-950/60 border-rose-500/20 shadow-lg shadow-rose-950/10'
                }`}
              >
                {/* Table Header Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-extrabold text-white">Mesa {table.number}</span>
                    <span className="text-xs block text-slate-500 mt-0.5">Capacidad: {table.capacity} pers.</span>
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTable(table.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Interactive toggle block */}
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center w-full">
                  <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isAvailable ? 'Disponible' : 'Ocupada'}
                  </span>
                  
                  <button
                    onClick={() => onToggleTable(table.id, table.status)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isAvailable ? (
                      <ToggleLeft className="w-9 h-9 text-slate-650 cursor-pointer" />
                    ) : (
                      <ToggleRight className="w-9 h-9 text-indigo-500 cursor-pointer animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <LayoutGrid className="w-10 h-10 text-slate-650 mx-auto mb-3" />
            <p className="text-slate-500 text-xs">No hay mesas configuradas en este restaurante.</p>
          </div>
        )}
      </div>
    </div>
  );
}
