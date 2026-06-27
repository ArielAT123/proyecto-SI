import React from 'react';
import { Metrics } from '../../types';

interface AdminPeakHoursChartProps {
  activeMetrics: Metrics;
}

export default function AdminPeakHoursChart({ activeMetrics }: AdminPeakHoursChartProps) {
  const maxVal = Math.max(...activeMetrics.hourlyData.map(d => d.count), 1);

  return (
    <div className="lg:col-span-2 bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-brandText-title mb-1">Volumen de Reservas por Horario</h3>
        <p className="text-brandText-body text-xs mb-6">Mapeo de afluencia para detección de horas pico y aglomeraciones.</p>
      </div>

      {/* Vertical Bar Chart Container for horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-brand-border px-2 min-w-[550px]">
          {activeMetrics.hourlyData.map((data, index) => {
            const pct = (data.count / maxVal) * 105;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-brand-footer border border-brand-border px-2 py-1 rounded text-[10px] text-white font-bold mb-2 shadow-xl pointer-events-none translate-y-[-10px] z-10 whitespace-nowrap">
                  {data.count} reservas
                </div>

                {/* Bar */}
                <div 
                  style={{ height: `${pct > 0 ? Math.max(8, pct) : 2}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ease-out cursor-pointer ${
                    data.count > 0 
                      ? 'bg-gradient-to-t from-brand-primary to-brand-secondary group-hover:from-brand-primaryHover group-hover:to-brand-primary shadow-sm'
                      : 'bg-slate-200 hover:bg-slate-350'
                  }`}
                />

                {/* Label */}
                <span className="text-[10px] font-semibold text-brandText-disabled mt-2 whitespace-nowrap">
                  {data.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-xs text-brandText-subtitle">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-brand-primary rounded-full" />
          Concurrencia alta/reserva
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full" />
          Sin reservas
        </span>
      </div>
    </div>
  );
}
