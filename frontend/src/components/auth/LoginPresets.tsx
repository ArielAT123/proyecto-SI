import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface LoginPresetsProps {
  loading: boolean;
  onQuickLogin: (email: string) => Promise<void>;
}

export default function LoginPresets({ loading, onQuickLogin }: LoginPresetsProps) {
  const presets = [
    { label: 'Juan (Cliente - $150)', email: 'juan@cliente.com' },
    { label: 'María (Cliente - $15)', email: 'maria@cliente.com' },
    { label: 'Carlos (Dueño)', email: 'dueno@restaurante.com' },
    { label: 'Administrador', email: 'admin@sistema.com' },
  ];

  return (
    <div className="pt-4 border-t border-slate-850">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
        Acceso Rápido de Prueba (Simulado)
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.email}
            type="button"
            disabled={loading}
            onClick={() => onQuickLogin(preset.email)}
            className="p-2.5 bg-slate-950 hover:bg-indigo-600/10 border border-slate-850 hover:border-indigo-500/30 text-left rounded-xl transition-all text-xs text-slate-300 font-semibold truncate hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
