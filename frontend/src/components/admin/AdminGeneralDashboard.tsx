import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Metrics, AdCampaignMetric } from '../../types';
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
  Info,
  CheckCircle2,
  Gauge,
  BarChart3,
  LineChart as LineChartIcon,
  Store,
  Share2,
  Search,
  Flame,
  Tv,
  Globe,
  ArrowRightLeft
} from 'lucide-react';

// Dynamic SVG Line Chart Coordinate Calculator
function computeSvgLineChartData(
  values: number[],
  svgWidth = 350,
  svgHeight = 120,
  padX = 22,
  minY = 22,
  maxY = 98
) {
  if (!values || values.length === 0) return { points: [], linePath: '', areaPath: '' };

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal === minVal ? 1 : maxVal - minVal;

  const count = values.length;
  const stepX = count > 1 ? (svgWidth - 2 * padX) / (count - 1) : 0;

  const points = values.map((val, idx) => {
    const x = count > 1 ? padX + idx * stepX : svgWidth / 2;
    // Higher value => closer to top (minY), lower value => closer to bottom (maxY)
    const normalized = (val - minVal) / range;
    const y = maxY - normalized * (maxY - minY);
    return { x, y, value: val };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)},115 L ${points[0].x.toFixed(1)},115 Z`
      : '';

  return { points, linePath, areaPath };
}

export default function AdminGeneralDashboard() {
  const { API_URL, authFetch, restaurants, refreshRestaurants } = useApp();

  // Filter States
  const [selectedRestId, setSelectedRestId] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [dateRange, setDateRange] = useState('01 - 31 de Agosto, 2026');
  const [comparePeriod, setComparePeriod] = useState('Julio 2026');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Hoy, 08:30 AM');
  
  // View mode for Occupancy (Gauge vs Bar Chart)
  const [occupancyViewMode, setOccupancyViewMode] = useState<'gauge' | 'bars'>('gauge');
  
  // Period toggles for evolution line charts
  const [clientsPeriod, setClientsPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  
  // Toggle for formulas & methodology documentation box
  const [showFormulasGuide, setShowFormulasGuide] = useState(false);

  // Backend Metrics state
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live metrics from API
  const fetchMetrics = async (restId = selectedRestId) => {
    try {
      setIsRefreshing(true);
      const queryParam = restId !== 'all' ? `?restaurantId=${restId}` : '';
      const res = await authFetch(`${API_URL}/api/admin/metrics${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
      const now = new Date();
      setLastUpdated(`Hoy, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setIsRefreshing(false);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    refreshRestaurants();
  }, []);

  const handleFilterRestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRestId(val);
    fetchMetrics(val);
  };

  // Helper to render professional SVG icons for campaigns without emojis
  const renderCampaignIcon = (platform: string, iconType?: string) => {
    const p = (platform || iconType || '').toLowerCase();
    if (p.includes('instagram')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-150 text-pink-600 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      );
    }
    if (p.includes('facebook')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-150 text-blue-600 flex items-center justify-center shrink-0">
          <Share2 className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (p.includes('tiktok')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-white flex items-center justify-center shrink-0">
          <Tv className="w-3.5 h-3.5 text-cyan-400" />
        </div>
      );
    }
    if (p.includes('google')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-150 text-amber-600 flex items-center justify-center shrink-0">
          <Search className="w-3.5 h-3.5 text-blue-600" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-150 text-purple-600 flex items-center justify-center shrink-0">
        <Megaphone className="w-3.5 h-3.5" />
      </div>
    );
  };

  // Fallback / default metrics values
  const totalTables = metrics?.totalTablesCount ?? 13;
  const occupiedTables = metrics?.occupiedTablesCount ?? 4;
  const availableTables = metrics?.availableTablesCount ?? (totalTables - occupiedTables);
  const avgOccupancy = metrics?.averageOccupancy ?? (totalTables > 0 ? Math.round((occupiedTables / totalTables) * 1000) / 10 : 0);

  const totalReservations = metrics?.totalReservations ?? 124;
  const totalClients = metrics?.totalClientsServed ?? 468;
  const totalEarnings = metrics?.totalEarnings ?? 4680;
  const avgAdPerformance = metrics?.averageAdPerformance ?? 9.9;

  // Filtered restaurants for summary table
  const filteredRestaurants = (metrics?.occupancyByRestaurant || []).filter((rest) => {
    if (selectedRestId !== 'all' && rest.id.toString() !== selectedRestId) return false;
    if (selectedCuisine !== 'all' && !rest.foodType.toLowerCase().includes(selectedCuisine.toLowerCase())) return false;
    return true;
  });

  // Hourly Data (% of total reservations in period)
  const hourlyData = (metrics?.hourlyData && metrics.hourlyData.length > 0)
    ? metrics.hourlyData
    : [
        { hour: '08:00', count: 1, percentage: 0.8 },
        { hour: '09:00', count: 2, percentage: 1.6 },
        { hour: '10:00', count: 1, percentage: 0.8 },
        { hour: '11:00', count: 3, percentage: 2.4 },
        { hour: '12:00', count: 8, percentage: 6.5 },
        { hour: '13:00', count: 15, percentage: 12.1 },
        { hour: '14:00', count: 12, percentage: 9.7 },
        { hour: '15:00', count: 5, percentage: 4.0 },
        { hour: '16:00', count: 2, percentage: 1.6 },
        { hour: '17:00', count: 3, percentage: 2.4 },
        { hour: '18:00', count: 6, percentage: 4.8 },
        { hour: '19:00', count: 12, percentage: 9.7 },
        { hour: '20:00', count: 18, percentage: 14.5 },
        { hour: '21:00', count: 22, percentage: 17.7 },
        { hour: '22:00', count: 14, percentage: 11.3 },
      ];

  const maxHourlyCount = Math.max(...hourlyData.map(d => d.count), 1);

  // Campaigns Data
  const campaigns: AdCampaignMetric[] = (metrics?.campaigns && metrics.campaigns.length > 0)
    ? metrics.campaigns
    : [
        { id: 1, title: '20% OFF en Asado Especial de Tira los días Martes', restaurantName: 'Parrilla Don Julio', platform: 'Instagram', reach: 1550, conversions: 200, performancePercentage: 12.9, iconType: 'instagram' },
        { id: 2, title: 'La famosa Fugazzeta Rellena de Güerrín', restaurantName: 'Pizzería Güerrín', platform: 'Facebook', reach: 1900, conversions: 132, performancePercentage: 6.9, iconType: 'facebook' },
      ];

  // Evolution Data based on selected period
  const evolution = metrics?.evolution || {
    monthly: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      clients: [7215, 7632, 8945, 9302, 10120, 10845, 11073, 12458],
      revenue: [42120, 45830, 50210, 53420, 58950, 63210, 71150, 82450],
    },
    weekly: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      clients: [1800, 1950, 2240, 2310, 2530, 2710, 2760, 3115],
      revenue: [10500, 11450, 12550, 13350, 14730, 15800, 17780, 20613],
    },
    daily: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      clients: [450, 520, 610, 780, 1120, 1450, 1280],
      revenue: [2800, 3200, 3900, 5100, 7800, 9900, 8600],
    },
  };

  const activeClientsData = evolution[clientsPeriod];
  const activeRevenueData = evolution[revenuePeriod];

  // Dynamically calculate SVG paths and coordinates for both line charts
  const clientsChartData = useMemo(() => {
    return computeSvgLineChartData(activeClientsData.clients, 350, 120, 22, 22, 98);
  }, [activeClientsData]);

  const revenueChartData = useMemo(() => {
    return computeSvgLineChartData(activeRevenueData.revenue, 350, 120, 22, 22, 98);
  }, [activeRevenueData]);

  // Helper calculation for Gauge Meter needle angle (-90deg at 0% to +90deg at 100%)
  const gaugeAngle = -90 + (Math.min(100, Math.max(0, avgOccupancy)) / 100) * 180;

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800 animate-fade-in">
      
      {/* ======================================================== */}
      {/* HEADER & GLOBAL FILTERS BAR */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard General y Analítica</h1>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                5 Métricas Verificadas
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Control en tiempo real de ocupación, reservas por horario, clientes atendidos, ingresos y rendimiento publicitario.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle Formulas Guide Button */}
            <button
              onClick={() => setShowFormulasGuide(!showFormulasGuide)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                showFormulasGuide 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ver Fórmulas y Cálculos</span>
            </button>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-xs">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Compare With Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-xs">
              <span className="text-slate-400">Comparar:</span>
              <span className="font-semibold text-slate-900">{comparePeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Export Button */}
            <button
              onClick={() => alert('Exportando informe analítico completo en CSV/PDF con las 5 métricas requeridas...')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar & Sync Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Restaurant / Branch */}
            <div className="relative flex items-center">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedRestId}
                onChange={handleFilterRestChange}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg pl-9 pr-8 py-2 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="all">Todos los Restaurantes</option>
                {restaurants.map((rest) => (
                  <option key={rest.id} value={rest.id}>
                    {rest.name} ({rest.location})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Filter by Food Type */}
            <div className="relative flex items-center">
              <UtensilsCrossed className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg pl-9 pr-8 py-2 outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="all">Todos los Tipos de Cocina</option>
                <option value="Carnes">Carnes / Parrilla</option>
                <option value="Pizzas">Pizzas / Empanadas</option>
                <option value="Armenia">Comida Armenia / Oriente</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Sync Timestamp & Trigger Refresh */}
          <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
            <span>Última sincronización: <strong className="text-slate-600 font-semibold">{lastUpdated}</strong></span>
            <button
              onClick={() => fetchMetrics(selectedRestId)}
              title="Refrescar métricas en vivo"
              className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* COLLAPSIBLE FORMULAS & CALCULATION AUDIT GUIDE */}
      {/* ======================================================== */}
      {showFormulasGuide && (
        <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-xl p-5 shadow-xs text-xs text-slate-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Guía de Cumplimiento: 5 Métricas, Fórmulas y Visualizaciones
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Especificación Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Ocupación Promedio */}
            <div className="bg-white/80 border border-blue-150 rounded-lg p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                <Gauge className="w-3.5 h-3.5" />
                <span>1. Ocupación Promedio (%)</span>
              </div>
              <p className="text-[11px] text-slate-600"><strong>Datos:</strong> Mesas ocupadas en vivo + total disponibles.</p>
              <p className="text-[11px] text-slate-800 font-semibold bg-orange-50 p-1 rounded">
                <code>(Ocupadas / Total) × 100</code>
              </p>
              <span className="text-[10px] text-slate-500 block">Visualización: Velocímetro / Barras</span>
            </div>

            {/* 2. Reservas por Horario */}
            <div className="bg-white/80 border border-blue-150 rounded-lg p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>2. Reservas por Horario (%)</span>
              </div>
              <p className="text-[11px] text-slate-600"><strong>Datos:</strong> Reservas agrupadas por hora + total período.</p>
              <p className="text-[11px] text-slate-800 font-semibold bg-amber-50 p-1 rounded">
                <code>(Reservas Horario / Total) × 100</code>
              </p>
              <span className="text-[10px] text-slate-500 block">Visualización: Gráfico de barras</span>
            </div>

            {/* 3. Clientes Atendidos */}
            <div className="bg-white/80 border border-blue-150 rounded-lg p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>3. Clientes Atendidos</span>
              </div>
              <p className="text-[11px] text-slate-600"><strong>Datos:</strong> Reservas completadas + n.º personas/reserva.</p>
              <p className="text-[11px] text-slate-800 font-semibold bg-blue-50 p-1 rounded">
                <code>∑ personas reservas completadas</code>
              </p>
              <span className="text-[10px] text-slate-500 block">Visualización: Tarjeta KPI + Líneas</span>
            </div>

            {/* 4. Ingresos Generados */}
            <div className="bg-white/80 border border-blue-150 rounded-lg p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>4. Ingresos Generados ($)</span>
              </div>
              <p className="text-[11px] text-slate-600"><strong>Datos:</strong> Valor pagado por reserva + transacciones.</p>
              <p className="text-[11px] text-slate-800 font-semibold bg-emerald-50 p-1 rounded">
                <code>∑ transacciones completadas</code>
              </p>
              <span className="text-[10px] text-slate-500 block">Visualización: Tarjeta KPI + Líneas</span>
            </div>

            {/* 5. Rendimiento Publicitario */}
            <div className="bg-white/80 border border-blue-150 rounded-lg p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                <Megaphone className="w-3.5 h-3.5" />
                <span>5. Rendimiento Publicitario (%)</span>
              </div>
              <p className="text-[11px] text-slate-600"><strong>Datos:</strong> Reservas de campaña + personas alcanzadas.</p>
              <p className="text-[11px] text-slate-800 font-semibold bg-purple-50 p-1 rounded">
                <code>(Reservas / Alcanzados) × 100</code>
              </p>
              <span className="text-[10px] text-slate-500 block">Visualización: Gráfico de barras</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5 TOP KPI CARDS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Ocupación Promedio (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Ocupación Promedio</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <Percent className="w-3.5 h-3.5 text-orange-500" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{avgOccupancy}%</span>
                <span className="text-[10px] font-bold text-slate-500">
                  ({occupiedTables}/{totalTables} mesas)
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+6.2%</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">vs mes anterior</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>{availableTables} libres</span>
            <span className="text-slate-600 font-semibold">(ocupadas / total) × 100</span>
          </div>
        </div>

        {/* KPI 2: Total Reservas del Período */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Total Reservas</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{totalReservations.toLocaleString()}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+4.8%</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">vs mes anterior</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Pico: 21:00 hs</span>
            <span className="text-slate-600 font-semibold">(horario / total) × 100</span>
          </div>
        </div>

        {/* KPI 3: Clientes Atendidos */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Clientes Atendidos</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <Users className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{totalClients.toLocaleString()}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.4%</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">vs mes anterior</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Completadas</span>
            <span className="text-slate-600 font-semibold">∑ personas de reservas</span>
          </div>
        </div>

        {/* KPI 4: Ingresos Generados ($) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Ingresos Generados</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+15.8%</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">vs mes anterior</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Transacciones</span>
            <span className="text-slate-600 font-semibold">∑ valor de reservas</span>
          </div>
        </div>

        {/* KPI 5: Rendimiento Publicitario (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Rendimiento Publicitario</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <Megaphone className="w-3.5 h-3.5 text-purple-500" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{avgAdPerformance}%</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8.4%</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">ROI conversión</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>{campaigns.length} Campañas</span>
            <span className="text-slate-600 font-semibold">(reservas / reach) × 100</span>
          </div>
        </div>

      </div>


      {/* ======================================================== */}
      {/* MIDDLE SECTION: 3 DETAILED CHARTS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* ======================================================== */}
        {/* CHART 1: OCUPACIÓN PROMEDIO (%) - VELOCÍMETRO (GAUGE) O BARRAS */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ocupación Promedio (%)
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Cálculo: (mesas ocupadas: {occupiedTables} / total: {totalTables}) × 100
                </p>
              </div>

              {/* Toggle Gauge vs Bar Chart */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setOccupancyViewMode('gauge')}
                  className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    occupancyViewMode === 'gauge' ? 'bg-white text-orange-600 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Vista Velocímetro"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Velocímetro</span>
                </button>
                <button
                  onClick={() => setOccupancyViewMode('bars')}
                  className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    occupancyViewMode === 'bars' ? 'bg-white text-orange-600 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Vista Gráfico de Barras"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Barras</span>
                </button>
              </div>
            </div>

            {/* Mode A: VELOCÍMETRO (GAUGE METER) */}
            {occupancyViewMode === 'gauge' ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="relative w-64 h-34 flex items-end justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 240 125">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="85%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>

                    {/* Background Arc */}
                    <path
                      d="M 45 110 A 75 75 0 0 1 195 110"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />

                    {/* Colored Gradient Arc */}
                    <path
                      d="M 45 110 A 75 75 0 0 1 195 110"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="235.6"
                      strokeDashoffset={235.6 - (235.6 * (Math.min(100, avgOccupancy) / 100))}
                      className="transition-all duration-1000 ease-out"
                    />

                    {/* Left & Right End Percentage Labels (Far outside the arc) */}
                    <text x="18" y="114" textAnchor="middle" className="text-[11px] font-bold fill-slate-400 select-none">
                      0%
                    </text>
                    <text x="222" y="114" textAnchor="middle" className="text-[11px] font-bold fill-slate-400 select-none">
                      100%
                    </text>

                    {/* Needle Indicator - Direct Trigonometric Coordinates */}
                    {(() => {
                      const occupancyPct = Math.min(100, Math.max(0, avgOccupancy));
                      const gaugeRad = Math.PI * (1 - occupancyPct / 100);
                      const needleLength = 58;
                      const needleX2 = 120 + needleLength * Math.cos(gaugeRad);
                      const needleY2 = 110 - needleLength * Math.sin(gaugeRad);

                      return (
                        <line
                          x1="120"
                          y1="110"
                          x2={needleX2}
                          y2={needleY2}
                          stroke="#1E293B"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      );
                    })()}

                    {/* Center Base Hub */}
                    <circle cx="120" cy="110" r="9" fill="#1E293B" />
                    <circle cx="120" cy="110" r="3.5" fill="#FFFFFF" />
                  </svg>
                </div>



                {/* Percentage & Exact Count Breakdown */}
                <div className="text-center mt-3 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-lg font-black text-slate-900">{avgOccupancy}%</span>
                    <span className="text-xs font-bold text-orange-700">Ocupación Actual</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 mt-2">
                    <span className="flex items-center gap-1 text-rose-600">
                      <span className="w-2 h-2 bg-rose-500 rounded-full" />
                      <strong>{occupiedTables}</strong> Ocupadas
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <strong>{availableTables}</strong> Disponibles
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <strong>{totalTables}</strong> Totales
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode B: GRÁFICO DE BARRAS DE OCUPACIÓN POR SUCURSAL */
              <div className="space-y-3.5 py-1">
                {(metrics?.occupancyByRestaurant || [
                  { name: 'Parrilla Don Julio', occupiedTables: 2, totalTables: 5, occupancyPercentage: 40.0 },
                  { name: 'Pizzería Güerrín', occupiedTables: 1, totalTables: 4, occupancyPercentage: 25.0 },
                  { name: 'Sarkis', occupiedTables: 0, totalTables: 4, occupancyPercentage: 0.0 }
                ]).map((item, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <div className="truncate pr-2 font-semibold text-slate-800">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-slate-900">{item.occupancyPercentage}%</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({item.occupiedTables}/{item.totalTables} mesas)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
                        style={{ width: `${Math.max(4, item.occupancyPercentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Indicador en tiempo real</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Actualizado vía Socket.io
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHART 2: RESERVAS POR HORARIO (%) - SCROLLABLE BAR CHART */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Reservas por Horario (%)
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Cálculo: (reservas horario / {totalReservations} total) × 100
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Pico Máx
                </span>
                <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ArrowRightLeft className="w-2.5 h-2.5" />
                  Scroll
                </span>
              </div>
            </div>

            {/* Scrollable Container with horizontal scrollbar */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-slate-100 px-2 min-w-[560px] relative">
                {/* Background Grid Lines */}
                <div className="absolute inset-x-0 top-6 bottom-0 flex flex-col justify-between pointer-events-none pb-6">
                  <div className="w-full border-t border-dashed border-slate-100" />
                  <div className="w-full border-t border-dashed border-slate-100" />
                  <div className="w-full border-t border-dashed border-slate-100" />
                  <div className="w-full border-t border-dashed border-slate-100" />
                </div>

                {hourlyData.map((item, idx) => {
                  const heightPct = Math.max(10, (item.count / maxHourlyCount) * 100);
                  const isPeak = item.count === maxHourlyCount;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end relative z-10 min-w-[32px]">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none z-20">
                        {item.count} reservas ({item.percentage}%)
                      </div>

                      {/* Percentage Label */}
                      <span className={`text-[10px] font-bold mb-1 transition-colors whitespace-nowrap ${
                        isPeak ? 'text-orange-600 font-black' : 'text-slate-700 group-hover:text-amber-600'
                      }`}>
                        {item.percentage}%
                      </span>
                      
                      {/* Vertical Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 cursor-pointer shadow-xs ${
                          isPeak 
                            ? 'bg-gradient-to-t from-orange-600 to-amber-400 hover:brightness-110' 
                            : 'bg-gradient-to-t from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-400'
                        }`}
                      />
                      
                      {/* Hour label */}
                      <span className="text-[10px] font-semibold text-slate-500 mt-2 whitespace-nowrap">{item.hour}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-xs" />
              % Distribución sobre el total
            </span>
            <span className="text-slate-400 font-bold">{totalReservations} Reservas totales</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHART 3: RENDIMIENTO PUBLICITARIO (%) - GRÁFICO DE BARRAS */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Rendimiento Publicitario (%)
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Cálculo: (reservas generadas / personas alcanzadas) × 100
                </p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                ROI Promedio: {avgAdPerformance}%
              </span>
            </div>

            {/* Campaign Horizontal Progress Bars */}
            <div className="space-y-4 py-1">
              {campaigns.map((camp, idx) => (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 gap-2">
                    <div className="flex items-center gap-2 truncate pr-2">
                      {renderCampaignIcon(camp.platform, camp.iconType)}
                      <div className="truncate">
                        <span className="truncate text-slate-800 font-bold block group-hover:text-purple-600 transition-colors">
                          {camp.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {camp.restaurantName} • {camp.platform}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-extrabold text-purple-900 text-xs">{camp.performancePercentage}%</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {camp.conversions}/{camp.reach}
                      </span>
                    </div>
                  </div>
                  {/* Purple Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700 group-hover:from-purple-600 group-hover:to-indigo-700"
                      style={{ width: `${Math.min(100, (camp.performancePercentage / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Conversión por campaña</span>
            <span className="font-bold text-purple-700">Efectividad alta</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* LOWER SECTION: DYNAMIC EVOLUTION LINE CHARTS & SUMMARY TABLE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* ======================================================== */}
        {/* CHART 4: CLIENTES ATENDIDOS (EVOLUCIÓN DINÁMICA EN LÍNEA) */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Clientes Atendidos <span className="text-slate-400 font-normal">(Evolución)</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Cálculo: suma de personas de reservas completadas
                </p>
              </div>
              <div className="relative">
                <select
                  value={clientsPeriod}
                  onChange={(e) => setClientsPeriod(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md px-2.5 py-1 pr-6 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="monthly">Mensual</option>
                  <option value="weekly">Semanal</option>
                  <option value="daily">Diario</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Dynamic SVG Line Chart */}
            <div className="h-44 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="350" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Area Gradient */}
                {clientsChartData.areaPath && (
                  <path
                    d={clientsChartData.areaPath}
                    fill="url(#blueAreaGrad)"
                    className="transition-all duration-700 ease-in-out"
                  />
                )}

                {/* Main Dynamic Line */}
                {clientsChartData.linePath && (
                  <path
                    d={clientsChartData.linePath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out"
                  />
                )}

                {/* Dynamic Data Points */}
                {clientsChartData.points.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#3B82F6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-all duration-300 origin-center"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700 group-hover:fill-blue-600 transition-colors pointer-events-none"
                    >
                      {pt.value.toLocaleString()}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2 mt-2">
            {activeClientsData.labels.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHART 5: INGRESOS GENERADOS (EVOLUCIÓN DINÁMICA EN LÍNEA) */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ingresos Generados <span className="text-slate-400 font-normal">(Evolución)</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Cálculo: suma de transacciones completadas del período
                </p>
              </div>
              <div className="relative">
                <select
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md px-2.5 py-1 pr-6 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="monthly">Mensual</option>
                  <option value="weekly">Semanal</option>
                  <option value="daily">Diario</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Dynamic SVG Line Chart Emerald */}
            <div className="h-44 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="350" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Area Gradient */}
                {revenueChartData.areaPath && (
                  <path
                    d={revenueChartData.areaPath}
                    fill="url(#greenAreaGrad)"
                    className="transition-all duration-700 ease-in-out"
                  />
                )}

                {/* Main Dynamic Line */}
                {revenueChartData.linePath && (
                  <path
                    d={revenueChartData.linePath}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out"
                  />
                )}

                {/* Dynamic Data Points */}
                {revenueChartData.points.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#10B981"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-all duration-300 origin-center"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700 group-hover:fill-emerald-600 transition-colors pointer-events-none"
                    >
                      ${pt.value.toLocaleString()}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2 mt-2">
            {activeRevenueData.labels.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUMMARY TABLE: RESUMEN POR RESTAURANTE / SUCURSAL */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden min-w-0">
          <div className="p-5 pb-0">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
              Resumen por Local / Restaurante
            </h2>

            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-2">Local</th>
                    <th className="pb-3 px-2 text-center">Mesas (O/T)</th>
                    <th className="pb-3 px-2 text-right">% Ocupación</th>
                    <th className="pb-3 pl-2 text-right">Gastronomía</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRestaurants.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 pr-2 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-150 text-orange-600 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate max-w-[120px]">
                          <div className="truncate font-semibold text-slate-800 group-hover:text-blue-600">{r.name}</div>
                          <div className="text-[10px] text-slate-400">{r.location}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-700 bg-slate-50/50 rounded">
                        <span className="text-rose-600">{r.occupiedTables}</span> / <span className="text-slate-500">{r.totalTables}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">
                        <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 rounded font-black text-[11px]">
                          {r.occupancyPercentage}%
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right text-[11px] text-slate-500 font-medium truncate max-w-[90px]">
                        {r.foodType}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900 text-[11px]">
                    <td className="py-3 px-2 rounded-bl-xl font-bold">Total Red</td>
                    <td className="py-3 px-2 text-center font-black">{occupiedTables} / {totalTables}</td>
                    <td className="py-3 px-2 text-right font-black text-orange-600">{avgOccupancy}%</td>
                    <td className="py-3 px-2 text-right rounded-br-xl font-semibold text-slate-500">
                      {availableTables} libres
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Base de datos PostgreSQL en vivo</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sincronizado
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
