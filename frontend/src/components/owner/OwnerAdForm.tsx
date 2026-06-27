import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Image, Link2, Plus, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface OwnerAdFormProps {
  selectedRestId: string;
  onRefreshDetails: () => Promise<void>;
}

export default function OwnerAdForm({ selectedRestId, onRefreshDetails }: OwnerAdFormProps) {
  const { API_URL, refreshAds, authFetch } = useApp();
  
  const [adTitle, setAdTitle] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adRedirect, setAdRedirect] = useState('');
  const [adIsActive, setAdIsActive] = useState(true);
  const [success, setSuccess] = useState('');

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImage) return;

    try {
      const res = await authFetch(`${API_URL}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: parseInt(selectedRestId),
          title: adTitle,
          image: adImage,
          redirectUrl: adRedirect || null,
          isActive: adIsActive,
        }),
      });
      if (res.ok) {
        setSuccess('Campaña publicitaria creada con éxito.');
        setAdTitle('');
        setAdImage('');
        setAdRedirect('');
        await onRefreshDetails();
        await refreshAds();
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adPresets = [
    {
      title: 'Descuento del 15% en tu reserva de mesa',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: '¡Hora Feliz! Bebidas a mitad de precio de 18:00 a 20:00 hs',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-indigo-400" />
        Nueva Campaña de Anuncios
      </h3>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleCreateAd} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título de la Promoción</label>
          <input
            type="text"
            required
            placeholder="Ej: 2x1 en postres de Lunes a Jueves"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL de la Imagen Banner</label>
          <div className="relative">
            <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              required
              placeholder="https://images.unsplash.com/..."
              value={adImage}
              onChange={(e) => setAdImage(e.target.value)}
              className="w-full pl-10 bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {adPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAdTitle(preset.title);
                  setAdImage(preset.image);
                }}
                className="text-[10px] bg-slate-950 hover:bg-indigo-600/10 border border-slate-850 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition-all font-semibold"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Enlace de Redirección (Opcional)</label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder={`Ej: /restaurant/${selectedRestId}`}
              value={adRedirect}
              onChange={(e) => setAdRedirect(e.target.value)}
              className="w-full pl-10 bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-855">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Activar al crear</span>
          <button
            type="button"
            onClick={() => setAdIsActive(!adIsActive)}
            className="text-slate-400 hover:text-white"
          >
            {adIsActive ? (
              <ToggleRight className="w-9 h-9 text-indigo-500" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-650" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Crear Campaña
        </button>
      </form>
    </div>
  );
}
