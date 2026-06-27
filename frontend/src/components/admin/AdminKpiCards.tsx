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
      <div className="bg-brand-card border border-brand-borderCard p-6 rounded-card shadow-brandCard relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brandText-subtitle">
            Clientes Atendidos
          </span>
          <h3 className="text-3xl font-extrabold text-brandText-title">
            {activeMetrics.totalClientsToday}
          </h3>
          <p className="text-[10px] text-brand-accent flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs. período anterior</span>
          </p>
        </div>
        <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary rounded-2xl">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 2: Ingresos */}
      <div className="bg-brand-card border border-brand-borderCard p-6 rounded-card shadow-brandCard relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brandText-subtitle">
            Ingresos Generados
          </span>
          <h3 className="text-3xl font-extrabold text-brand-accent">
            ${activeMetrics.totalEarnings.toFixed(2)}
          </h3>
          <p className="text-[10px] text-brand-accent flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% vs. período anterior</span>
          </p>
        </div>
        <div className="p-4 bg-brand-accent/5 border border-brand-accent/10 text-brand-accent rounded-2xl">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 3: Ocupación */}
      <div className="bg-brand-card border border-brand-borderCard p-6 rounded-card shadow-brandCard relative overflow-hidden flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brandText-subtitle">
            Ocupación Promedio
          </span>
          <h3 className="text-3xl font-extrabold text-brand-primary">
            {activeMetrics.averageOccupancy}%
          </h3>
          <p className="text-[10px] text-brandText-disabled">
            Capacidad activa de piso
          </p>
        </div>
        <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary rounded-2xl">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
