import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant, Ad } from '../types';
import OwnerTableGrid from './owner/OwnerTableGrid';
import OwnerTableForm from './owner/OwnerTableForm';
import OwnerAdForm from './owner/OwnerAdForm';
import OwnerAdList from './owner/OwnerAdList';
import { Settings } from 'lucide-react';

export default function OwnerView() {
  const { restaurants, API_URL, refreshRestaurants, refreshAds, authFetch } = useApp();
  const [selectedRestId, setSelectedRestId] = useState('');
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [adList, setAdList] = useState<Ad[]>([]);

  // Default selection
  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestId) {
      setSelectedRestId(restaurants[0].id.toString());
    }
  }, [restaurants]);

  // Load details
  const loadRestaurantDetails = async () => {
    if (!selectedRestId) return;
    try {
      const res = await fetch(`${API_URL}/api/restaurants/${selectedRestId}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurantData(data);
      }
      
      const adsRes = await authFetch(`${API_URL}/api/restaurants/${selectedRestId}/ads`);
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAdList(adsData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRestaurantDetails();
  }, [selectedRestId, restaurants]);

  // Toggle Table status (AVAILABLE <-> OCCUPIED)
  const handleToggleTable = async (tableId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    try {
      const res = await authFetch(`${API_URL}/api/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setRestaurantData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tables: prev.tables?.map(t => t.id === tableId ? { ...t, status: nextStatus as any } : t)
          };
        });
        await refreshRestaurants();
      }
    } catch (err) {
      console.error('Error toggling table status:', err);
    }
  };

  // Delete Table
  const handleDeleteTable = async (tableId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta mesa?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/tables/${tableId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadRestaurantDetails();
        await refreshRestaurants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Ad Campaign Activation status
  const handleToggleAd = async (adId: number) => {
    try {
      const res = await authFetch(`${API_URL}/api/ads/${adId}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setAdList(prev => prev.map(ad => ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad));
        await refreshAds();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. RESTAURANT SELECTOR */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Panel de Operador del Restaurante
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestión en tiempo real de la disponibilidad de las mesas de tu local y campañas publicitarias.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-300">Seleccionar Local:</label>
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {restaurantData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: GRID DE MESAS */}
          <div className="lg:col-span-2 space-y-6">
            <OwnerTableGrid
              restaurantData={restaurantData}
              onToggleTable={handleToggleTable}
              onDeleteTable={handleDeleteTable}
            />

            <OwnerTableForm
              selectedRestId={selectedRestId}
              onRefreshDetails={loadRestaurantDetails}
            />
          </div>

          {/* RIGHT: CAMPAIGN / PUBLICIDAD MANAGER */}
          <div className="lg:col-span-1 space-y-6">
            <OwnerAdForm
              selectedRestId={selectedRestId}
              onRefreshDetails={loadRestaurantDetails}
            />

            <OwnerAdList
              adList={adList}
              onToggleAd={handleToggleAd}
            />
          </div>

        </div>
      ) : (
        <div className="text-center py-12">Cargando datos del local...</div>
      )}
    </div>
  );
}
