import React from 'react';
import { Metrics } from '../../types';

interface AdminPeakHoursChartProps {
  activeMetrics: Metrics;
}

export default function AdminPeakHoursChart({ activeMetrics }: AdminPeakHoursChartProps) {
  const maxVal = Math.max(...activeMetrics.hourlyData.map(d => d.count), 1);

  return (
    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white mb-1">Volumen de Reservas por Horario</h3>
        <p className="text-slate-400 text-xs mb-6">Mapeo de afluencia para detección de horas pico y aglomeraciones.</p>
      </div>

      {/* Vertical Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-2.5 pt-6 border-b border-slate-800 px-2">
        {activeMetrics.hourlyData.map((data, index) => {
          const pct = (data.count / maxVal) * 105;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-850 px-2 py-1 rounded text-[10px] text-slate-200 font-bold mb-2 shadow-xl pointer-events-none translate-y-[-10px] z-10 whitespace-nowrap">
                {data.count} reservas
              </div>

              {/* Bar */}
              <div 
                style={{ height: `${pct > 0 ? Math.max(8, pct) : 2}%` }}
                className={`w-full rounded-t-lg transition-all duration-500 ease-out cursor-pointer ${
                  data.count > 0 
                    ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-lg shadow-indigo-950/20'
                    : 'bg-slate-800/40 hover:bg-slate-800'
                }`}
              />

              {/* Label */}
              <span className="text-[10px] font-semibold text-slate-500 mt-2 rotate-45 sm:rotate-0 origin-center">
                {data.hour}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
          Concurrencia alta/reserva
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          Sin reservas
        </span>
      </div>
    </div>
  );
}
