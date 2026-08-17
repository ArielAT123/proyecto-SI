import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Percent,
  Megaphone,
  ChevronDown,
  Building2,
  MapPin,
  UtensilsCrossed,
  Filter
} from 'lucide-react';

interface CompanySummary {
  id: string;
  name: string;
  branchesCount: number;
  clients: number;
  revenue: number;
  avgOccupancy: number;
  colorBg: string;
  colorText: string;
  icon: string;
}

export default function AdminGeneralDashboard() {
  // Global Filter States
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [dateRange, setDateRange] = useState('01 - 31 de Agosto, 2026');
  const [comparePeriod, setComparePeriod] = useState('Julio 2026');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Hoy, 08:30 AM');
  const [clientsPeriod, setClientsPeriod] = useState<'Mensual' | 'Semanal' | 'Diario'>('Mensual');
  const [revenuePeriod, setRevenuePeriod] = useState<'Mensual' | 'Semanal' | 'Diario'>('Mensual');

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(`Hoy, ${timeStr}`);
    }, 600);
  };

  // Mock data for Company Summary Table
  const companiesData: CompanySummary[] = [
    { id: '1', name: 'La Trattoria', branchesCount: 3, clients: 4521, revenue: 29850, avgOccupancy: 81.3, colorBg: 'bg-red-500', colorText: 'text-white', icon: '🍷' },
    { id: '2', name: 'Sushi House', branchesCount: 2, clients: 3210, revenue: 21450, avgOccupancy: 76.7, colorBg: 'bg-blue-600', colorText: 'text-white', icon: '🍣' },
    { id: '3', name: 'Burger Station', branchesCount: 2, clients: 2845, revenue: 15780, avgOccupancy: 69.2, colorBg: 'bg-amber-500', colorText: 'text-white', icon: '🍔' },
    { id: '4', name: 'Cevicheria del Mar', branchesCount: 2, clients: 1965, revenue: 9420, avgOccupancy: 72.5, colorBg: 'bg-emerald-500', colorText: 'text-white', icon: '🐟' },
    { id: '5', name: 'Pasta & Basta', branchesCount: 2, clients: 1245, revenue: 4980, avgOccupancy: 80.1, colorBg: 'bg-orange-500', colorText: 'text-white', icon: '🍝' },
    { id: '6', name: 'BBQ Grill', branchesCount: 1, clients: 652, revenue: 990, avgOccupancy: 65.6, colorBg: 'bg-rose-600', colorText: 'text-white', icon: '🥩' }
  ];

  // Filter companies based on selections
  const filteredCompanies = companiesData.filter(c => {
    if (selectedCompany !== 'all' && c.name.toLowerCase() !== selectedCompany.toLowerCase()) return false;
    return true;
  });

  const totalBranches = filteredCompanies.reduce((acc, curr) => acc + curr.branchesCount, 0);
  const totalClients = filteredCompanies.reduce((acc, curr) => acc + curr.clients, 0);
  const totalRevenue = filteredCompanies.reduce((acc, curr) => acc + curr.revenue, 0);
  const overallAvgOccupancy = filteredCompanies.length > 0
    ? (filteredCompanies.reduce((acc, curr) => acc + curr.avgOccupancy, 0) / filteredCompanies.length).toFixed(1)
    : '0.0';

  // Evolution charts data
  const evolutionMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
  const clientsData = [7215, 7632, 8945, 9302, 10120, 10845, 11073, 12458];
  const revenueData = [42120, 45830, 50210, 53420, 58950, 63210, 71150, 82450];

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      
      {/* ======================================================== */}
      {/* HEADER & GLOBAL FILTERS BAR */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        {/* Title and Top Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard General</h1>
            <p className="text-sm text-slate-500 mt-0.5">Resumen de rendimiento de todas las empresas y sucursales</p>
          </div>

          {/* Right Header Control Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-sm">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Compare With Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-sm">
              <span className="text-slate-400">Comparar con:</span>
              <span className="font-semibold text-slate-900">{comparePeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Export Button */}
            <button
              onClick={() => alert('Exportando informe general en CSV/PDF...')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Filters and Sync Strip */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Select Empresas */}
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 pr-8 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="all">Todas las Empresas</option>
                <option value="La Trattoria">La Trattoria</option>
                <option value="Sushi House">Sushi House</option>
                <option value="Burger Station">Burger Station</option>
                <option value="Cevicheria del Mar">Cevicheria del Mar</option>
                <option value="Pasta & Basta">Pasta & Basta</option>
                <option value="BBQ Grill">BBQ Grill</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Select Sucursales */}
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 pr-8 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="all">Todas las Sucursales</option>
                <option value="Centro">Centro</option>
                <option value="Mall del Sol">Mall del Sol</option>
                <option value="Urdesa">Urdesa</option>
                <option value="Samborondón">Samborondón</option>
                <option value="Kennedy">Kennedy</option>
                <option value="Alborada">Alborada</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Select Tipos de Cocina */}
            <div className="relative">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 pr-8 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="all">Todos los Tipos de Cocina</option>
                <option value="Italiana">Italiana</option>
                <option value="Japonesa">Japonesa</option>
                <option value="Americana">Americana</option>
                <option value="Mariscos">Mariscos</option>
                <option value="Parrilla">Parrilla</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sync Timestamp */}
          <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
            <span>Última actualización: <strong className="text-slate-600 font-semibold">{lastUpdated}</strong></span>
            <button
              onClick={handleRefresh}
              title="Refrescar datos"
              className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5 TOP KPI CARDS WITH SPARK LINES */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Ocupación Promedio */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>OCUPACIÓN PROMEDIO (%)</span>
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">78.5%</span>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>6.2% vs. Julio 2026</span>
              </div>
            </div>
          </div>
          {/* Orange Line Sparkline */}
          <div className="mt-4 h-9 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0,22 Q15,20 30,25 T60,15 T80,10 T100,5"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="5" r="3" fill="#FF6B00" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Reservas por Horario */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>RESERVAS POR HORARIO (%)</span>
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">2,842</span>
              <p className="text-xs text-slate-400 font-medium mt-1">Total de reservas</p>
            </div>
          </div>
          {/* Orange Mini Bar Sparkline */}
          <div className="mt-4 h-9 w-full flex items-end justify-between gap-1">
            {[40, 65, 90, 75, 50, 85].map((val, idx) => (
              <div key={idx} className="flex-1 bg-orange-200 rounded-t" style={{ height: `${val}%` }}>
                <div className="w-full bg-orange-500 rounded-t h-full opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* KPI 3: Clientes Atendidos */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>CLIENTES ATENDIDOS</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">12,458</span>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>12.4% vs. Julio 2026</span>
              </div>
            </div>
          </div>
          {/* Blue Line Sparkline */}
          <div className="mt-4 h-9 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0,25 Q20,22 40,20 T70,12 T100,6"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="6" r="3" fill="#3B82F6" />
            </svg>
          </div>
        </div>

        {/* KPI 4: Ingresos Generados */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>INGRESOS GENERADOS ($)</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">$82,450.00</span>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>15.8% vs. Julio 2026</span>
              </div>
            </div>
          </div>
          {/* Green Line Sparkline */}
          <div className="mt-4 h-9 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0,26 Q25,22 50,18 T80,10 T100,4"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="4" r="3" fill="#10B981" />
            </svg>
          </div>
        </div>

        {/* KPI 5: Rendimiento Publicitario */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>RENDIMIENTO PUBLICITARIO (%)</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">42.8%</span>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>8.4% vs. Julio 2026</span>
              </div>
            </div>
          </div>
          {/* Purple Line Sparkline */}
          <div className="mt-4 h-9 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0,24 Q30,22 50,16 T85,14 T100,5"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="5" r="3" fill="#8B5CF6" />
            </svg>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MIDDLE SECTION: 3 DETAILED CHARTS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART 1: OCUPACIÓN PROMEDIO POR SUCURSAL (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              OCUPACIÓN PROMEDIO POR SUCURSAL (%)
            </h2>

            <div className="space-y-3.5">
              {[
                { name: 'La Trattoria - Centro', val: 85.2, change: 8.1, color: 'bg-blue-600' },
                { name: 'Sushi House - Mall del Sol', val: 74.3, change: 5.4, color: 'bg-blue-600' },
                { name: 'Burger Station - Urdesa', val: 68.9, change: 2.3, color: 'bg-orange-500' },
                { name: 'Cevicheria del Mar - Samborondón', val: 72.1, change: -1.2, color: 'bg-emerald-500' },
                { name: 'Pasta & Basta - Kennedy', val: 81.7, change: 9.7, color: 'bg-orange-500' },
                { name: 'BBQ Grill - Alborada', val: 65.5, change: -3.1, color: 'bg-rose-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="truncate pr-2 font-semibold">{item.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900">{item.val}%</span>
                      <span className={`text-[11px] font-semibold flex items-center ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {item.change >= 0 ? `↑ ${item.change}%` : `↓ ${Math.abs(item.change)}%`}
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scale Axis Labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-4 border-t border-slate-100 mt-4">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* CHART 2: RESERVAS POR HORARIO (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              RESERVAS POR HORARIO (%)
            </h2>

            {/* Vertical Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 px-2">
              {[
                { time: '12:00', pct: 18 },
                { time: '13:00', pct: 27 },
                { time: '14:00', pct: 20 },
                { time: '19:00', pct: 15 },
                { time: '20:00', pct: 20 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                  {/* Percentage label above bar */}
                  <span className="text-xs font-bold text-slate-800 mb-1">{item.pct}%</span>
                  
                  {/* Bar */}
                  <div
                    style={{ height: `${(item.pct / 30) * 100}%` }}
                    className="w-full max-w-[42px] bg-orange-500 rounded-t-sm hover:bg-orange-600 transition-all cursor-pointer shadow-sm"
                  />
                  
                  {/* Hour label */}
                  <span className="text-xs font-medium text-slate-500 mt-2">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 pt-3">
            <span className="w-3 h-3 bg-orange-500 rounded-sm" />
            <span>% de Reservas</span>
          </div>
        </div>

        {/* CHART 3: RENDIMIENTO PUBLICITARIO POR CAMPAÑA (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              RENDIMIENTO PUBLICITARIO POR CAMPAÑA (%)
            </h2>

            <div className="space-y-5">
              {[
                { campaign: 'Instagram Ads', pct: 42.8 },
                { campaign: 'Facebook Ads', pct: 34.5 },
                { campaign: 'TikTok Ads', pct: 38.2 },
                { campaign: 'Google Ads', pct: 40.1 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.campaign}</span>
                    <span className="font-bold text-slate-900">{item.pct}%</span>
                  </div>
                  {/* Purple Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-700 hover:bg-purple-600"
                      style={{ width: `${(item.pct / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Axis Scale */}
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-4 border-t border-slate-100 mt-4">
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
            <span>40%</span>
            <span>50%</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* LOWER SECTION: EVOLUTION CHARTS & SUMMARY TABLE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART 4: CLIENTES ATENDIDOS (EVOLUCIÓN) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                CLIENTES ATENDIDOS <span className="text-slate-400 font-normal">(Evolución)</span>
              </h2>
              <div className="relative">
                <select
                  value={clientsPeriod}
                  onChange={(e) => setClientsPeriod(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md px-2.5 py-1 pr-6 outline-none cursor-pointer"
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Diario">Diario</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-44 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="350" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Line Path */}
                <path
                  d="M10,95 L55,85 L100,65 L145,58 L190,45 L235,32 L280,28 L340,10"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />

                {/* Data Points with Values */}
                {[
                  { x: 10, y: 95, val: '7,215' },
                  { x: 55, y: 85, val: '7,632' },
                  { x: 100, y: 65, val: '8,945' },
                  { x: 145, y: 58, val: '9,302' },
                  { x: 190, y: 45, val: '10,120' },
                  { x: 235, y: 32, val: '10,845' },
                  { x: 280, y: 28, val: '11,073' },
                  { x: 340, y: 10, val: '12,458' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 mt-2">
            {evolutionMonths.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* CHART 5: INGRESOS GENERADOS (EVOLUCIÓN) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                INGRESOS GENERADOS <span className="text-slate-400 font-normal">(Evolución)</span>
              </h2>
              <div className="relative">
                <select
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md px-2.5 py-1 pr-6 outline-none cursor-pointer"
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Diario">Diario</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Line Chart Green */}
            <div className="h-44 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="350" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Line Path */}
                <path
                  d="M10,95 L55,87 L100,75 L145,68 L190,52 L235,42 L280,25 L340,10"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />

                {/* Points */}
                {[
                  { x: 10, y: 95, val: '$42,120' },
                  { x: 55, y: 87, val: '$45,830' },
                  { x: 100, y: 75, val: '$50,210' },
                  { x: 145, y: 68, val: '$53,420' },
                  { x: 190, y: 52, val: '$58,950' },
                  { x: 235, y: 42, val: '$63,210' },
                  { x: 280, y: 25, val: '$71,150' },
                  { x: 340, y: 10, val: '$82,450' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 mt-2">
            {evolutionMonths.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* TABLE: RESUMEN POR EMPRESA */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              RESUMEN POR EMPRESA
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                    <th className="pb-2">Empresa</th>
                    <th className="pb-2 text-center">Sucursales</th>
                    <th className="pb-2 text-right">Clientes</th>
                    <th className="pb-2 text-right">Ingresos</th>
                    <th className="pb-2 text-right">Ocupación Prom.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {filteredCompanies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${c.colorBg} ${c.colorText}`}>
                          {c.icon}
                        </span>
                        <span className="truncate max-w-[100px]">{c.name}</span>
                      </td>
                      <td className="py-2.5 text-center font-medium">{c.branchesCount}</td>
                      <td className="py-2.5 text-right font-medium">{c.clients.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-semibold text-slate-900">${c.revenue.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-medium">{c.avgOccupancy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Footer Row */}
          <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50 -mx-5 -mb-5 p-4">
            <span>Total General</span>
            <div className="flex items-center gap-4 text-right">
              <span>{totalBranches} Sucursales</span>
              <span>{totalClients.toLocaleString()} Clientes</span>
              <span className="text-emerald-600">${totalRevenue.toLocaleString()}</span>
              <span>{overallAvgOccupancy}%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
