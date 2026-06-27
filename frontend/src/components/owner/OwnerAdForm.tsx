import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Image, Link2, Plus, CheckCircle2, ToggleLeft, ToggleRight, FileUp } from 'lucide-react';

interface OwnerAdFormProps {
  selectedRestId: string;
  onRefreshDetails: () => Promise<void>;
}

export default function OwnerAdForm({ selectedRestId, onRefreshDetails }: OwnerAdFormProps) {
  const { API_URL, refreshAds, authFetch } = useApp();
  
  const [adTitle, setAdTitle] = useState('');
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [adImage, setAdImage] = useState('');
  const [adFile, setAdFile] = useState<File | null>(null);
  const [adRedirect, setAdRedirect] = useState('');
  const [adIsActive, setAdIsActive] = useState(true);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle) return;
    if (imageType === 'file' && !adFile) return;
    if (imageType === 'url' && !adImage) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('restaurantId', selectedRestId);
      formData.append('title', adTitle);
      formData.append('redirectUrl', adRedirect || '');
      formData.append('isActive', adIsActive.toString());

      if (imageType === 'file' && adFile) {
        formData.append('imageFile', adFile);
      } else {
        formData.append('image', adImage);
      }

      const res = await authFetch(`${API_URL}/api/ads`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess('Campaña publicitaria creada con éxito.');
        setAdTitle('');
        setAdImage('');
        setAdFile(null);
        setAdRedirect('');
        await onRefreshDetails();
        await refreshAds();
        setTimeout(() => setSuccess(''), 3500);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Error al crear la campaña');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard">
      <h3 className="text-base font-bold text-brandText-title mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-brand-primary" />
        Nueva Campaña de Anuncios
      </h3>

      {success && (
        <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleCreateAd} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Título de la Promoción</label>
          <input
            type="text"
            required
            placeholder="Ej: 2x1 en postres de Lunes a Jueves"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
            className="w-full bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors placeholder:text-brandText-disabled"
          />
        </div>

        {/* Image Source Selection Tabs */}
        <div>
          <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Origen del Banner</label>
          <div className="grid grid-cols-2 gap-2 bg-brand-bg p-1 rounded-xl border border-brand-border mb-3">
            <button
              type="button"
              onClick={() => setImageType('file')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                imageType === 'file'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brandText-disabled hover:text-brandText-subtitle'
              }`}
            >
              Cargar Archivo
            </button>
            <button
              type="button"
              onClick={() => setImageType('url')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                imageType === 'url'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brandText-disabled hover:text-brandText-subtitle'
              }`}
            >
              Enlace URL / Preset
            </button>
          </div>

          {imageType === 'file' ? (
            <div className="relative">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-border border-dashed rounded-input cursor-pointer bg-white hover:bg-brand-bg transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 text-brandText-disabled mb-2" />
                    <p className="text-xs text-brandText-body font-semibold">
                      {adFile ? adFile.name : 'Haz clic para seleccionar imagen'}
                    </p>
                    <p className="text-[10px] text-brandText-disabled mt-1">PNG, JPG o WEBP (máx. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAdFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brandText-disabled w-4 h-4" />
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={adImage}
                  onChange={(e) => setAdImage(e.target.value)}
                  className="w-full pl-10 bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors placeholder:text-brandText-disabled"
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
                    className="text-[10px] bg-brand-bg hover:bg-brand-primary/5 border border-brand-border px-2.5 py-1.5 rounded-lg text-brandText-body hover:text-brand-primary hover:border-brand-primary transition-all font-semibold"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brandText-subtitle uppercase tracking-wider mb-2">Enlace de Redirección (Opcional)</label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brandText-disabled w-4 h-4" />
            <input
              type="text"
              placeholder={`Ej: /restaurant/${selectedRestId}`}
              value={adRedirect}
              onChange={(e) => setAdRedirect(e.target.value)}
              className="w-full pl-10 bg-white border border-brand-borderInput text-brandText-title rounded-input px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors placeholder:text-brandText-disabled"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-brand-bg rounded-xl border border-brand-border">
          <span className="text-xs text-brandText-subtitle font-semibold uppercase tracking-wider">Activar al crear</span>
          <button
            type="button"
            onClick={() => setAdIsActive(!adIsActive)}
            className="text-brandText-disabled hover:text-brandText-subtitle"
          >
            {adIsActive ? (
              <ToggleRight className="w-9 h-9 text-brand-primary" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-brandText-disabled" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive disabled:opacity-50 text-white font-semibold py-3 rounded-btn transition-all shadow-brandCard flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>{loading ? 'Creando...' : 'Crear Campaña'}</span>
        </button>
      </form>
    </div>
  );
}
