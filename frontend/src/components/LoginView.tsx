import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginForm from './auth/LoginForm';
import LoginPresets from './auth/LoginPresets';
import { Store, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  
  // Shared form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [presetError, setPresetError] = useState('');

  const handleQuickLogin = async (presetEmail: string) => {
    setPresetError('');
    setEmail(presetEmail);
    setPassword('password123');
    setLoading(true);
    
    const res = await login(presetEmail, 'password123');
    setLoading(false);
    if (!res.success) {
      setPresetError(res.error || 'Error en inicio rápido');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-650/30 flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">
            Anti<span className="gradient-text">Crowd</span>
          </h1>
          <span className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase block mt-[-3px]">
            Restaurante Inteligente
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Tab Switchers */}
        <div className="flex border-b border-slate-850 bg-slate-950/40">
          <button
            onClick={() => {
              setIsLogin(true);
              setPresetError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              isLogin 
                ? 'border-indigo-500 text-white bg-slate-900/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setPresetError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              !isLogin 
                ? 'border-indigo-500 text-white bg-slate-900/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Body content */}
        <div className="p-8 space-y-6">
          {presetError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{presetError}</span>
            </div>
          )}

          <LoginForm
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            setLoading={setLoading}
          />

          {/* Quick presets for evaluation convenience */}
          <LoginPresets
            loading={loading}
            onQuickLogin={handleQuickLogin}
          />
        </div>
      </div>
    </div>
  );
}
