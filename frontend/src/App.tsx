import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ClientView from './components/ClientView';
import WalletView from './components/WalletView';
import OwnerView from './components/OwnerView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import BookingModal from './components/client/BookingModal';
import { Wallet, LogOut, ShieldAlert, Store, Menu, X, ChevronLeft, ChevronRight, User as UserIcon, Layers, Megaphone, BarChart3, Users } from 'lucide-react';
import aforoGoIcon from './assets/aforoGo_icon.png';
import { Restaurant } from './types';

function AppContent() {
  const { API_URL, currentUser, token, logout, loading } = useApp();
  const [clientTab, setClientTab] = useState<'home' | 'wallet'>('home');
  const [ownerTab, setOwnerTab] = useState<'tables' | 'ads'>('tables');
  const [adminTab, setAdminTab] = useState<'stats' | 'locales' | 'users'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Lifted Client Booking States
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [bookingTime, setBookingTime] = useState('20:00');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'OWNER') {
      return ownerTab === 'tables' ? 'Empleado / Operador' : 'Dueño';
    }
    return currentUser.role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-brandText-subtitle text-sm font-medium">Cargando sesión...</span>
      </div>
    );
  }

  // Not authenticated? Show login form.
  if (!token || !currentUser) {
    return <LoginView />;
  }

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    setIsUserMenuOpen(false);
    logout();
  };

  const handleCancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const userInitials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

  const sidebarContent = (isMobile: boolean) => {
    const collapsed = !isMobile && isSidebarCollapsed;

    return (
      <div className="flex flex-col h-full justify-between p-4 relative">
        {/* Brand logo & Profile section */}
        <div className="space-y-6">

          {/* Logo & Toggle Button */}
          <div className="flex items-center justify-between pt-2">
            <div className={`flex flex-col items-center mx-auto transition-all ${collapsed ? 'w-12 h-12' : 'w-24 h-24'}`}>
              <img src={aforoGoIcon} alt="AforoGo Logo" className="w-full h-full object-contain" />
            </div>
            {!isMobile && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute top-4 -right-3 bg-white border border-brand-border p-1 rounded-full shadow-md text-brandText-subtitle hover:text-brand-primary hover:border-brand-primary transition-all z-30"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Status badges depending on role */}
          {!collapsed && (
            <>
              {currentUser.role === 'OWNER' && (
                <div className="bg-brand-primary/5 border border-brand-primary/20 px-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-primary flex items-center gap-1 justify-center">
                  <Store className="w-3.5 h-3.5" />
                  <span>Vista Operativa</span>
                </div>
              )}

              {currentUser.role === 'ADMIN' && (
                <div className="bg-brand-accent/5 border border-brand-accent/20 px-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-accent flex items-center gap-1 justify-center">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Administración</span>
                </div>
              )}
            </>
          )}

          {/* Navigation Section */}
          <nav className="flex flex-col gap-2 pt-2">
            {currentUser.role === 'CLIENT' && (
              <>
                <button
                  onClick={() => {
                    setClientTab('home');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Restaurantes"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${clientTab === 'home'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Store className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Restaurantes</span>}
                </button>
                <button
                  onClick={() => {
                    setClientTab('wallet');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Billetera y Reservas"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${clientTab === 'wallet'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Wallet className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Billetera y Reservas</span>}
                </button>

                {/* Wallet Balance Badge */}
                <div
                  onClick={() => {
                    setClientTab('wallet');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title={`Saldo: $${currentUser.balance.toFixed(2)}`}
                  className={`mt-4 bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/20 px-3 py-3 rounded-xl flex items-center cursor-pointer transition-all hover:scale-[1.02] ${collapsed ? 'justify-center' : 'justify-between'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-brand-primary shrink-0" />
                    {!collapsed && <span className="text-xs font-bold text-brandText-subtitle">Saldo:</span>}
                  </div>
                  {!collapsed && <span className="text-sm font-black text-brand-primary">${currentUser.balance.toFixed(2)}</span>}
                </div>
              </>
            )}
            {currentUser.role === 'OWNER' && (
              <>
                <button
                  onClick={() => {
                    setOwnerTab('tables');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Gestión de Mesas"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${ownerTab === 'tables'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Layers className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Gestión de Mesas</span>}
                </button>
                <button
                  onClick={() => {
                    setOwnerTab('ads');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Campañas de Publicidad"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${ownerTab === 'ads'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Megaphone className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Campañas de Publicidad</span>}
                </button>
              </>
            )}
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => {
                    setAdminTab('stats');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Estadísticas"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'stats'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <BarChart3 className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Estadísticas</span>}
                </button>
                <button
                  onClick={() => {
                    setAdminTab('locales');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Gestión de Locales"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'locales'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Store className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Gestión de Locales</span>}
                </button>
                <button
                  onClick={() => {
                    setAdminTab('users');
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title="Gestión de Usuarios"
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'users'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-brandText-subtitle hover:text-brand-primary hover:bg-brand-primary/5'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <Users className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Gestión de Usuarios</span>}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User profile popover & toggle at the bottom */}
        <div className="relative">
          {isUserMenuOpen && (
            <div className={`absolute bottom-16 bg-white border border-brand-border rounded-xl shadow-brandCard p-3 z-50 space-y-2 w-52 ${collapsed ? 'left-0' : 'left-0'
              } animate-fade-in`}>
              <div className="border-b border-brand-border pb-2 text-left">
                <p className="text-xs font-bold text-brandText-title truncate">{currentUser.name}</p>
                <p className="text-[10px] text-brandText-disabled truncate mt-0.5">{currentUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  handleLogoutClick();
                }}
                className="w-full flex items-center gap-2 text-left text-xs font-bold text-brand-primary hover:bg-brand-primary/5 p-2 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}

          {/* User profile card trigger */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 hover:bg-brand-bg rounded-xl border border-transparent hover:border-brand-border transition-all ${collapsed ? 'justify-center' : 'justify-between'
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {userInitials}
              </div>
              {!collapsed && (
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-brandText-title truncate max-w-[110px] leading-tight">{currentUser.name}</p>
                  <p className="text-[9px] text-brandText-disabled font-semibold uppercase leading-none mt-0.5">{getRoleLabel()}</p>
                </div>
              )}
            </div>
            {!collapsed && <UserIcon className="w-4 h-4 text-brandText-disabled shrink-0" />}
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row relative">

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex items-center justify-between h-16 bg-brand-navbar border-b border-brand-border px-4 sticky top-0 z-30 shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-brandText-subtitle hover:text-brand-primary rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <img src={aforoGoIcon} alt="AforoGo Logo" className="w-14 h-14 object-contain" />
        {currentUser.role === 'CLIENT' ? (
          <div
            onClick={() => setClientTab('wallet')}
            className="flex items-center gap-1.5 bg-brand-primary/5 px-2.5 py-1.5 rounded-lg border border-brand-primary/15"
          >
            <Wallet className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-xs font-black text-brand-primary">${currentUser.balance.toFixed(0)}</span>
          </div>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* MOBILE DRAWER OVERLAY BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#202124]/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MOBILE DRAWER SIDEBAR CONTAINER */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-brand-navbar border-r border-brand-border z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 bg-brand-bg hover:bg-brand-border text-brandText-subtitle rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {sidebarContent(true)}
      </div>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside className={`hidden md:flex flex-col h-screen sticky top-0 bg-brand-navbar border-r border-brand-border z-20 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
        {sidebarContent(false)}
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col justify-between min-w-0 relative">

        {/* MAIN VIEW CONTENT */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {currentUser.role === 'CLIENT' && (
            <>
              {clientTab === 'home' ? (
                <ClientView
                  onNavigateToWallet={() => setClientTab('wallet')}
                  selectedRestaurant={selectedRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                  selectedTable={selectedTable}
                  setSelectedTable={setSelectedTable}
                  bookingTime={bookingTime}
                  setBookingTime={setBookingTime}
                  errorMsg={errorMsg}
                  setErrorMsg={setErrorMsg}
                  successMsg={successMsg}
                  setSuccessMsg={setSuccessMsg}
                />
              ) : (
                <WalletView />
              )}
            </>
          )}

          {currentUser.role === 'OWNER' && <OwnerView activeTab={ownerTab} />}

          {currentUser.role === 'ADMIN' && <AdminView activeTab={adminTab} />}
        </main>
      </div>

      {/* LIFTED ROOT-LEVEL BOOKING MODAL (FOR PERFECT FULL SCREEN BACKDROP BLUR) */}
      {selectedRestaurant && (
        <BookingModal
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          bookingTime={bookingTime}
          setBookingTime={setBookingTime}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
          onNavigateToWallet={() => setClientTab('wallet')}
          onRefreshDetail={async (rest) => {
            const res = await fetch(`${API_URL}/api/restaurants/${rest.id}`);
            if (res.ok) {
              const data = await res.json();
              setSelectedRestaurant(data);
            }
          }}
        />
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-[#202124]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-borderCard rounded-card max-w-sm w-full p-6 shadow-brandCard animate-fade-in text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brandText-title">¿Cerrar Sesión?</h3>
              <p className="text-xs text-brandText-body mt-2">
                ¿Estás seguro de que deseas salir de tu cuenta en AforoGo!? Deberás volver a iniciar sesión para gestionar tus reservas.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleCancelLogout}
                className="flex-1 py-2.5 bg-brand-bg hover:bg-brand-border border border-brand-border text-brandText-subtitle rounded-btn text-xs font-bold transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive text-white rounded-btn text-xs font-bold transition-all shadow-brandCard active:scale-95"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

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
