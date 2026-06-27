import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant, Ad } from '../types';
import OwnerTableGrid from './owner/OwnerTableGrid';
import OwnerTableForm from './owner/OwnerTableForm';
import OwnerAdForm from './owner/OwnerAdForm';
import OwnerAdList from './owner/OwnerAdList';
import { Settings, Layers, Megaphone } from 'lucide-react';

interface OwnerViewProps {
  activeTab: 'tables' | 'ads';
}

export default function OwnerView({ activeTab }: OwnerViewProps) {
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
      <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-brandCard">
        <div>
          <h2 className="text-xl font-bold text-brandText-title flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-primary" />
            {activeTab === 'tables' ? 'Panel de Operador (Empleado / Operador)' : 'Panel de Campañas Publicitarias (Dueño)'}
          </h2>
          <p className="text-brandText-body text-xs mt-1">
            {activeTab === 'tables' 
              ? 'Gestión en tiempo real de la disponibilidad de las mesas de tu local.' 
              : 'Diseño, publicación y activación de promociones y anuncios publicitarios de tus locales.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-brandText-subtitle">Seleccionar Local:</label>
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 focus:outline-none focus:border-brand-primary font-semibold transition-colors hover:border-brand-primary cursor-pointer"
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
        <>
          {activeTab === 'tables' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: GRID DE MESAS */}
              <div className="lg:col-span-2">
                <OwnerTableGrid
                  restaurantData={restaurantData}
                  onToggleTable={handleToggleTable}
                  onDeleteTable={handleDeleteTable}
                />
              </div>

              {/* RIGHT: AGREGAR MESA FORM */}
              <div className="lg:col-span-1">
                <OwnerTableForm
                  selectedRestId={selectedRestId}
                  onRefreshDetails={loadRestaurantDetails}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: CREAR CAMPAÑA FORM */}
              <div className="lg:col-span-1">
                <OwnerAdForm
                  selectedRestId={selectedRestId}
                  onRefreshDetails={loadRestaurantDetails}
                />
              </div>

              {/* RIGHT: HISTORIAL DE CAMPAÑAS */}
              <div className="lg:col-span-2">
                <OwnerAdList
                  adList={adList}
                  onToggleAd={handleToggleAd}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">Cargando datos del local...</div>
      )}
    </div>
  );
}
