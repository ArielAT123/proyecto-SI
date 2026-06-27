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
        }),
      });
      if (res.ok) {
        setSuccess('Mesa añadida correctamente.');
        setTableNumber('');
        await onRefreshDetails();
        await refreshRestaurants();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-400" />
        Configurar Piso: Agregar Mesa
      </h3>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleAddTable} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Mesa</label>
          <input
            type="number"
            required
            min="1"
            placeholder="Ej: 6"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Capacidad (Personas)</label>
          <select
            value={tableCapacity}
            onChange={(e) => setTableCapacity(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="2">2 Personas (Mesa Chica)</option>
            <option value="4">4 Personas (Mesa Mediana)</option>
            <option value="6">6 Personas (Mesa Grande)</option>
            <option value="8">8 Personas (Mesa Grupal)</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Agregar Mesa
        </button>
      </form>
    </div>
  );
}
