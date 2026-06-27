import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export default function LoginForm({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  setLoading,
}: LoginFormProps) {
  const { login, register } = useApp();
  
  // Register specific fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('CLIENT');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isLogin) {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciales inválidas');
      }
    } else {
      const res = await register(name, email, password, role);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Registro exitoso. Iniciando sesión...');
      } else {
        setErrorMsg(res.error || 'Error al registrar usuario');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isLogin && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Ej: Pedro Gómez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Rol en el Sistema
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            >
              <option value="CLIENT">Cliente (Reserva y Billetera)</option>
              <option value="OWNER">Operador de Restaurante (Mesas y Anuncios)</option>
              <option value="ADMIN">Administrador (Métricas Globales)</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="email"
            required
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Contraseña
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <span>{isLogin ? 'Acceder al Sistema' : 'Crear Cuenta'}</span>
        )}
      </button>
    </form>
  );
}
