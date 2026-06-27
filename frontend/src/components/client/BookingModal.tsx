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
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

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
        setShowSuccessDialog(true);
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
    <div className="fixed inset-0 bg-[#202124]/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-borderCard rounded-card max-w-2xl w-full overflow-hidden shadow-brandCard relative max-h-[90vh] flex flex-col animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="absolute top-4 right-4 p-2 bg-brand-bg hover:bg-brand-border text-brandText-subtitle rounded-full transition-colors z-10"
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
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="bg-brand-primary text-xs font-semibold px-2.5 py-0.5 rounded-full text-white">
              {selectedRestaurant.foodType}
            </span>
            <h2 className="text-2xl font-bold text-brandText-title mt-1">{selectedRestaurant.name}</h2>
            <p className="text-brandText-subtitle text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-brandText-disabled" />
              {selectedRestaurant.location}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Alert status Messages */}
          {successMsg && (
            <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Reserva exitosa</h4>
                <p className="text-xs text-brand-accent/80 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Error al reservar</h4>
                <p className="text-xs text-brand-error/80 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Grid of Tables */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brandText-subtitle mb-3">
              Selecciona una Mesa Disponible
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                    className={`p-0 rounded-xl border text-left transition-all relative flex flex-col overflow-hidden ${
                      !isAvailable
                        ? 'bg-slate-100 border-brand-border text-brandText-disabled cursor-not-allowed opacity-75'
                        : isSelected
                        ? 'bg-brand-primary/5 border-brand-primary text-brandText-title shadow-sm ring-1 ring-brand-primary'
                        : 'bg-white border-brand-border text-brandText-body hover:border-brand-primary/30 hover:bg-slate-50'
                    }`}
                  >
                    {/* Table Preview Image */}
                    <div className="w-full h-24 bg-slate-100 relative shrink-0">
                      <img
                        src={table.preview || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80'}
                        alt={`Mesa #${table.number}`}
                        className={`w-full h-full object-cover ${!isAvailable && 'grayscale'}`}
                      />
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <span className="bg-brand-error text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Ocupada</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 w-full flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">Mesa #{table.number}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isAvailable ? 'bg-brand-accent' : 'bg-brand-error'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-brandText-disabled mt-0.5">Capacidad: {table.capacity} pers.</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-brand-border flex justify-between items-center w-full">
                        <span className="text-[10px] text-brandText-disabled">Costo:</span>
                        <span className={`text-xs font-black ${!isAvailable ? 'text-brandText-disabled' : 'text-brand-accent'}`}>
                          ${cost}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedTable && (
            <div className="bg-brand-bg p-4 rounded-input border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-primary" />
                <div>
                  <h4 className="text-sm font-semibold text-brandText-title">Configurar Horario</h4>
                  <p className="text-xs text-brandText-body">Selecciona el horario de tu reserva</p>
                </div>
              </div>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="bg-white border border-brand-borderInput text-brandText-title rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-primary text-sm font-semibold"
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
          <div className="p-6 bg-slate-50 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left w-full sm:w-auto">
              <span className="text-xs text-brandText-body block">Total a pagar de la Billetera:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brandText-title">${getTableCost(selectedTable.capacity)}</span>
                <span className="text-xs text-brandText-body">
                  (Tu saldo: <span className={currentUser.balance >= getTableCost(selectedTable.capacity) ? 'text-brand-accent font-semibold' : 'text-brand-error font-semibold'}>${currentUser.balance.toFixed(2)}</span>)
                </span>
              </div>
            </div>

            {currentUser.balance >= getTableCost(selectedTable.capacity) ? (
              <button
                onClick={handleBooking}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-6 py-3 rounded-btn transition-all shadow-brandCard hover:scale-105 active:scale-95"
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
                  className="bg-brand-secondary hover:bg-brand-secondary/95 text-white font-semibold px-6 py-3 rounded-btn transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-brandCard"
                >
                  <Wallet className="w-4 h-4" />
                  Recargar Billetera para reservar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SUCCESS CONFIRMATION POPUP */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-[#202124]/75 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-brand-borderCard rounded-card max-w-sm w-full p-6 shadow-brandCard text-center space-y-5 animate-fade-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brandText-title">¡Reserva Procesada!</h3>
              <p className="text-xs text-brandText-body mt-2">
                Tu reserva ha sido aceptada y procesada con éxito en **{selectedRestaurant.name}**. Hemos descontado el costo del saldo de tu billetera.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                setSelectedRestaurant(null); // Close the booking modal
              }}
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-btn text-xs font-bold transition-all shadow-brandCard active:scale-95 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
