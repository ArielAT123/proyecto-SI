import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Plus, CheckCircle2 } from 'lucide-react';

interface OwnerTableFormProps {
  selectedRestId: string;
  onRefreshDetails: () => Promise<void>;
}

export default function OwnerTableForm({ selectedRestId, onRefreshDetails }: OwnerTableFormProps) {
  const { API_URL, refreshRestaurants, authFetch } = useApp();
  const [tableNumber, setTableNumber] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');
  const [tablePreview, setTablePreview] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || !tableCapacity) return;

    try {
      const res = await authFetch(`${API_URL}/api/restaurants/${selectedRestId}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: parseInt(tableNumber),
          capacity: parseInt(tableCapacity),
          preview: tablePreview || null,
        }),
      });
      if (res.ok) {
        setSuccess('Mesa añadida correctamente.');
        setTableNumber('');
        setTablePreview('');
        await onRefreshDetails();
        await refreshRestaurants();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard">
      <h3 className="text-base font-bold text-brandText-title mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-brand-primary" />
        Configurar Piso: Agregar Mesa
      </h3>

      {success && (
        <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleAddTable} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Número de Mesa</label>
            <input
              type="number"
              required
              min="1"
              placeholder="Ej: 6"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary hover:border-brand-primary transition-colors placeholder:text-brandText-disabled"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Capacidad (Personas)</label>
            <select
              value={tableCapacity}
              onChange={(e) => setTableCapacity(e.target.value)}
              className="w-full bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary hover:border-brand-primary transition-colors cursor-pointer"
            >
              <option value="2">2 Personas (Mesa Chica)</option>
              <option value="4">4 Personas (Mesa Mediana)</option>
              <option value="6">6 Personas (Mesa Grande)</option>
              <option value="8">8 Personas (Mesa Grupal)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Imagen Preview de la Mesa (URL)</label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={tablePreview}
            onChange={(e) => setTablePreview(e.target.value)}
            className="w-full bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary hover:border-brand-primary transition-colors placeholder:text-brandText-disabled text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive text-white font-semibold py-3 rounded-btn transition-all shadow-brandCard flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Agregar Mesa
        </button>
      </form>
    </div>
  );
}
