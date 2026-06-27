import React from 'react';
import { Metrics } from '../../types';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface AdminKpiCardsProps {
  activeMetrics: Metrics;
}

export default function AdminKpiCards({ activeMetrics }: AdminKpiCardsProps) {
  return (
    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
      
      {/* KPI 1: Clientes */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Clientes Atendidos
          </span>
          <h3 className="text-3xl font-extrabold text-white">
            {activeMetrics.totalClientsToday}
          </h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs. período anterior</span>
          </p>
        </div>
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 2: Ingresos */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Ingresos Generados
          </span>
          <h3 className="text-3xl font-extrabold text-emerald-400">
            ${activeMetrics.totalEarnings.toFixed(2)}
          </h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% vs. período anterior</span>
          </p>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 3: Ocupación */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Ocupación Promedio
          </span>
          <h3 className="text-3xl font-extrabold text-indigo-400">
            {activeMetrics.averageOccupancy}%
          </h3>
          <p className="text-[10px] text-slate-400">
            Capacidad activa de piso
          </p>
        </div>
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
