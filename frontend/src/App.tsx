import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ClientView from './components/ClientView';
import WalletView from './components/WalletView';
import OwnerView from './components/OwnerView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import { Wallet, LogOut, ShieldAlert, Store, BarChart3 } from 'lucide-react';

function AppContent() {
  const { currentUser, token, logout, loading } = useApp();
  const [clientTab, setClientTab] = useState<'home' | 'wallet'>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-400 text-sm">Cargando sesión...</span>
      </div>
    );
  }

  // Not authenticated? Show login form.
  if (!token || !currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      
      {/* MAIN HEADER NAVBAR */}
      <header className="bg-slate-900/60 border-b border-slate-850 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/35 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Anti<span className="gradient-text">Crowd</span>
              </h1>
              <span className="text-[9px] text-slate-500 font-extrabold tracking-widest uppercase block mt-[-3px]">
                Restaurante Inteligente
              </span>
            </div>
          </div>

          {/* Sub Navigation depending on active role */}
          <div className="flex items-center gap-6">
            {currentUser.role === 'CLIENT' && (
              <>
                <nav className="flex gap-2">
                  <button
                    onClick={() => setClientTab('home')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      clientTab === 'home'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Restaurantes
                  </button>
                  <button
                    onClick={() => setClientTab('wallet')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      clientTab === 'wallet'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Billetera y Reservas
                  </button>
                </nav>

                {/* Wallet Balance Badge */}
                <div 
                  onClick={() => setClientTab('wallet')}
                  className="bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/25 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.03] active:scale-95"
                >
                  <Wallet className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">Billetera:</span>
                  <span className="text-sm font-black text-white">${currentUser.balance.toFixed(2)}</span>
                </div>
              </>
            )}

            {currentUser.role === 'OWNER' && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Store className="w-4 h-4" />
                <span>Vista Operativa del Local</span>
              </div>
            )}

            {currentUser.role === 'ADMIN' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Administración de Sistema</span>
              </div>
            )}

            {/* Logout button */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5 uppercase">{currentUser.role}</p>
              </div>
              
              <button
                onClick={logout}
                className="p-2.5 bg-slate-800 hover:bg-rose-600/10 text-slate-450 hover:text-rose-400 rounded-xl transition-colors border border-slate-750"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {currentUser.role === 'CLIENT' && (
          <>
            {clientTab === 'home' ? (
              <ClientView onNavigateToWallet={() => setClientTab('wallet')} />
            ) : (
              <WalletView />
            )}
          </>
        )}

        {currentUser.role === 'OWNER' && <OwnerView />}

        {currentUser.role === 'ADMIN' && <AdminView />}
      </main>

      {/* MAIN FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AntiCrowd S.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer">Términos</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidad</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Soporte</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
