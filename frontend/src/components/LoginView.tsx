import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginForm from './auth/LoginForm';
import LoginPresets from './auth/LoginPresets';
import { Shield, AlertCircle } from 'lucide-react';
import aforoGoIcon from '../assets/aforoGo_icon.png';

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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="flex flex-col items-center mb-6">
        <img src={aforoGoIcon} alt="AforoGo Logo" className="w-32 h-32 object-contain" />
      </div>

      <div className="w-full max-w-md bg-brand-card border border-brand-borderCard rounded-card shadow-brandCard overflow-hidden flex flex-col">
        {/* Tab Switchers */}
        <div className="flex border-b border-brand-border bg-slate-50">
          <button
            onClick={() => {
              setIsLogin(true);
              setPresetError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              isLogin 
                ? 'border-brand-primary text-brand-primary bg-white' 
                : 'border-transparent text-brandText-disabled hover:text-brandText-subtitle'
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
                ? 'border-brand-primary text-brand-primary bg-white' 
                : 'border-transparent text-brandText-disabled hover:text-brandText-subtitle'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Body content */}
        <div className="p-8 space-y-6">
          {presetError && (
            <div className="bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 rounded-xl flex items-center gap-3 text-xs">
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
