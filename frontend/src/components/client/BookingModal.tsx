import React from 'react';
import { useApp } from '../../context/AppContext';
import { Restaurant, Table } from '../../types';
import { MapPin, Wallet, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface BookingModalProps {
  selectedRestaurant: Restaurant;
  setSelectedRestaurant: (val: Restaurant | null) => void;
  selectedTable: Table | null;
  setSelectedTable: (val: Table | null) => void;
  bookingTime: string;
  setBookingTime: (val: string) => void;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  successMsg: string;
  setSuccessMsg: (val: string) => void;
  onNavigateToWallet: () => void;
  onRefreshDetail: (restaurant: Restaurant) => Promise<void>;
}

export default function BookingModal({
  selectedRestaurant,
  setSelectedRestaurant,
  selectedTable,
  setSelectedTable,
  bookingTime,
  setBookingTime,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  onNavigateToWallet,
  onRefreshDetail,
}: BookingModalProps) {
  const { currentUser, API_URL, refreshCurrentUser, authFetch } = useApp();

  if (!currentUser) return null;

  const getTableCost = (capacity: number) => {
    return capacity * 5;
  };

  const handleBooking = async () => {
    if (!selectedTable) return;
    const cost = getTableCost(selectedTable.capacity);

    if (currentUser.balance < cost) {
      setErrorMsg('Saldo insuficiente en la billetera virtual.');
      return;
    }

    try {
      const res = await authFetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          tableId: selectedTable.id,
          startTime: bookingTime,
          cost: cost,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('¡Reserva confirmada con éxito! Mesa reservada.');
        setErrorMsg('');
        setSelectedTable(null);
        await onRefreshDetail(selectedRestaurant);
        await refreshCurrentUser();
      } else {
        setErrorMsg(data.error || 'Error al realizar la reserva.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="relative h-48">
          <img
            src={selectedRestaurant.photo}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="bg-indigo-600 text-xs font-semibold px-2.5 py-0.5 rounded-full text-white">
              {selectedRestaurant.foodType}
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedRestaurant.name}</h2>
            <p className="text-slate-300 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {selectedRestaurant.location}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Alert status Messages */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Reserva exitosa</h4>
                <p className="text-xs text-emerald-500/80 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Error al reservar</h4>
                <p className="text-xs text-rose-500/80 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Grid of Tables */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Selecciona una Mesa Disponible
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedRestaurant.tables?.map((table) => {
                const isAvailable = table.status === 'AVAILABLE';
                const isSelected = selectedTable?.id === table.id;
                const cost = getTableCost(table.capacity);
                
                return (
                  <button
                    key={table.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedTable(table);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      !isAvailable
                        ? 'bg-slate-950/40 border-slate-900/60 text-slate-600 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-base">Mesa #{table.number}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAvailable ? 'bg-emerald-400' : 'bg-rose-550'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Capacidad: {table.capacity} pers.</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-800/60 flex justify-between items-center w-full">
                      <span className="text-xs text-slate-500">Costo:</span>
                      <span className={`text-sm font-bold ${!isAvailable ? 'text-slate-600' : 'text-emerald-400'}`}>
                        ${cost}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedTable && (
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Configurar Horario</h4>
                  <p className="text-xs text-slate-400">Selecciona el horario de tu reserva</p>
                </div>
              </div>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
              >
                <option value="12:00">12:00 hs (Almuerzo)</option>
                <option value="13:00">13:00 hs (Almuerzo)</option>
                <option value="14:00">14:00 hs (Almuerzo)</option>
                <option value="20:00">20:00 hs (Cena)</option>
                <option value="21:00">21:00 hs (Cena)</option>
                <option value="22:00">22:00 hs (Cena)</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Footer / Transaction Validation */}
        {selectedTable && (
          <div className="p-6 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left w-full sm:w-auto">
              <span className="text-xs text-slate-400 block">Total a pagar de la Billetera:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">${getTableCost(selectedTable.capacity)}</span>
                <span className="text-xs text-slate-500">
                  (Tu saldo: <span className={currentUser.balance >= getTableCost(selectedTable.capacity) ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>${currentUser.balance.toFixed(2)}</span>)
                </span>
              </div>
            </div>

            {currentUser.balance >= getTableCost(selectedTable.capacity) ? (
              <button
                onClick={handleBooking}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                Confirmar Reserva
              </button>
            ) : (
              <div className="w-full sm:w-auto flex flex-col items-stretch">
                <button
                  onClick={() => {
                    setSelectedRestaurant(null);
                    onNavigateToWallet();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-amber-600/20"
                >
                  <Wallet className="w-4 h-4" />
                  Recargar Billetera para reservar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
