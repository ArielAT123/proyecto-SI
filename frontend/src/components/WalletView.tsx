import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Plus, Clock, HelpCircle, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

export default function WalletView() {
  const { currentUser, rechargeWallet } = useApp();
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    setLoading(true);
    setSuccess(false);

    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await rechargeWallet(amount);
    setLoading(false);
    if (result) {
      setSuccess(true);
      setRechargeAmount('');
      // Reset success banner after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: WALLET CARD AND TOP-UP FORM */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Wallet Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/20 p-6 shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wallet className="w-32 h-32 text-indigo-400" />
          </div>
          
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Billetera Virtual
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            ${currentUser?.balance?.toFixed(2) || '0.00'}
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Saldo de uso instantáneo para reservas de mesas sin contacto.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-400 animate-pulse" />
            <span>Reservas prepagadas y seguras garantizadas.</span>
          </div>
        </div>

        {/* Top-Up Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Recargar Saldo Virtual
          </h3>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>¡Billetera recargada con éxito!</span>
            </div>
          )}

          <form onSubmit={handleRecharge} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Monto a Recargar ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="5"
                  max="1000"
                  placeholder="0.00"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl pl-8 pr-4 py-3 text-lg font-bold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setRechargeAmount(amt.toString())}
                  className="py-2 bg-slate-950/40 hover:bg-indigo-600/10 border border-slate-850 hover:border-indigo-500/30 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  +${amt}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !rechargeAmount || parseFloat(rechargeAmount) <= 0}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando Pago...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Cargar Saldo</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: RESERVATION HISTORY */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg h-full flex flex-col">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Historial de Reservas
          </h3>

          <div className="space-y-3 overflow-y-auto flex-grow max-h-[500px] pr-2">
            {currentUser?.reservations && currentUser.reservations.length > 0 ? (
              currentUser.reservations.map((res) => {
                return (
                  <div
                    key={res.id}
                    className="p-4 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {res.table?.restaurant?.name || 'Restaurante'}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Mesa #{res.table?.number} (Capacidad: {res.table?.capacity} pers.)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>Horario: {res.startTime} hs</span>
                          <span>•</span>
                          <span>Fecha: {new Date(res.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-850">
                      <span className="text-xs text-slate-400 sm:hidden">Costo:</span>
                      <span className="text-base font-bold text-emerald-400">${res.cost}</span>
                      <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Prepagada
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                <HelpCircle className="w-12 h-12 text-slate-750 mb-3" />
                <h4 className="text-slate-400 font-semibold">Sin reservas registradas</h4>
                <p className="text-slate-500 text-xs mt-1">
                  Tus reservas confirmadas aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
