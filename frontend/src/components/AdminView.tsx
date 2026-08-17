import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Metrics, Restaurant } from '../types';
import AdminKpiCards from './admin/AdminKpiCards';
import AdminPeakHoursChart from './admin/AdminPeakHoursChart';
import AdminGeneralDashboard from './admin/AdminGeneralDashboard';
import { 
  RefreshCw, 
  BarChart3, 
  HelpCircle, 
  Store, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Utensils, 
  UserCheck,
  X,
  Lock,
  Mail
} from 'lucide-react';

interface AdminViewProps {
  activeTab: 'stats' | 'locales' | 'users';
}

export default function AdminView({ activeTab }: AdminViewProps) {
  const { API_URL, authFetch, restaurants, refreshRestaurants } = useApp();
  
  // Metrics stats state
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedRestId, setSelectedRestId] = useState(''); // stats filter
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [activeRange, setActiveRange] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy');

  // Restaurant Management state
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [editRest, setEditRest] = useState<Restaurant | null>(null);
  const [restName, setRestName] = useState('');
  const [restLocation, setRestLocation] = useState('');
  const [restFoodType, setRestFoodType] = useState('');
  const [restPhoto, setRestPhoto] = useState('');
  const [restOwnerId, setRestOwnerId] = useState('');
  const [restSuccess, setRestSuccess] = useState('');

  // User Management state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // User Editing state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('OWNER');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserRestId, setEditUserRestId] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // Fetch metrics statistics
  const fetchMetrics = async (restId = selectedRestId) => {
    try {
      setLoadingMetrics(true);
      const queryParam = restId ? `?restaurantId=${restId}` : '';
      const res = await authFetch(`${API_URL}/api/admin/metrics${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
      setLoadingMetrics(false);
    } catch (err) {
      console.error(err);
      setLoadingMetrics(false);
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await authFetch(`${API_URL}/api/users`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
      setLoadingUsers(false);
    } catch (err) {
      console.error(err);
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
    refreshRestaurants();
  }, []);

  // Filter out CLIENT users - Admin ONLY manages OWNER and ADMIN accounts!
  const filteredUsers = usersList.filter(u => u.role === 'OWNER' || u.role === 'ADMIN');
  const ownersList = usersList.filter(u => u.role === 'OWNER');

  // Handle stats reload
  const handleRefreshStats = () => {
    fetchMetrics(selectedRestId);
  };

  const handleStatsFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRestId(val);
    fetchMetrics(val);
  };

  // Scaling logic based on range (Hoy/Semana/Mes)
  const getScaledMetrics = () => {
    if (!metrics) return null;
    if (activeRange === 'Hoy') return metrics;
    
    const scale = activeRange === 'Semana' ? 7 : 30;
    return {
      totalClientsToday: metrics.totalClientsToday * scale,
      totalEarnings: metrics.totalEarnings * scale,
      averageOccupancy: Math.min(95, metrics.averageOccupancy + (scale % 5)),
      hourlyData: metrics.hourlyData.map(d => ({
        ...d,
        count: d.count * scale,
      }))
    };
  };

  const activeMetrics = getScaledMetrics();

  // Create or Update Restaurant
  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName || !restLocation || !restFoodType) return;

    const payload = {
      name: restName,
      location: restLocation,
      foodType: restFoodType,
      photo: restPhoto || undefined,
      ownerId: restOwnerId ? parseInt(restOwnerId) : null,
    };

    try {
      let res;
      if (editRest) {
        res = await authFetch(`${API_URL}/api/restaurants/${editRest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch(`${API_URL}/api/restaurants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setRestSuccess(editRest ? 'Local actualizado con éxito.' : 'Local creado con éxito.');
        setRestName('');
        setRestLocation('');
        setRestFoodType('');
        setRestPhoto('');
        setRestOwnerId('');
        setEditRest(null);
        await refreshRestaurants();
        setTimeout(() => {
          setRestSuccess('');
          setIsRestModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Restaurant
  const handleDeleteRestaurant = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este local? Se eliminarán todas sus mesas y campañas.')) return;
    try {
      const res = await authFetch(`${API_URL}/api/restaurants/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshRestaurants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Restaurant Mode
  const handleOpenEditRest = (rest: Restaurant) => {
    setEditRest(rest);
    setRestName(rest.name);
    setRestLocation(rest.location);
    setRestFoodType(rest.foodType);
    setRestPhoto(rest.photo);
    setRestOwnerId((rest as any).ownerId ? String((rest as any).ownerId) : '');
    setIsRestModalOpen(true);
  };

  // Open Edit User Mode
  const handleOpenEditUser = (user: any) => {
    setEditUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserPassword('');
    
    // Find restaurant assigned to this owner
    const assignedRest = restaurants.find(r => (r as any).ownerId === user.id);
    setEditUserRestId(assignedRest ? String(assignedRest.id) : '');
    setIsUserModalOpen(true);
  };

  // Save User changes
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser || !editUserName || !editUserEmail) return;

    const payload = {
      name: editUserName,
      email: editUserEmail,
      role: editUserRole,
      password: editUserPassword || undefined,
      restaurantId: editUserRestId ? parseInt(editUserRestId) : null,
    };

    try {
      const res = await authFetch(`${API_URL}/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setUserSuccess('Usuario actualizado correctamente.');
        await fetchUsers();
        await refreshRestaurants();
        setTimeout(() => {
          setUserSuccess('');
          setIsUserModalOpen(false);
          setEditUser(null);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ======================================================== */}
      {/* 1. STATS TAB - GENERAL DASHBOARD */}
      {/* ======================================================== */}
      {activeTab === 'stats' && (
        <AdminGeneralDashboard />
      )}

      {/* ======================================================== */}
      {/* 2. LOCALES (RESTAURANTS) TAB */}
      {/* ======================================================== */}
      {activeTab === 'locales' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard">
            <div>
              <h2 className="text-xl font-bold text-brandText-title flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-primary" />
                Gestión de Locales y Asignación de Dueños
              </h2>
              <p className="text-brandText-body text-xs mt-1">
                Registra locales gastronómicos nuevos y asócialos a un propietario.
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditRest(null);
                setRestName('');
                setRestLocation('');
                setRestFoodType('');
                setRestPhoto('');
                setRestOwnerId('');
                setIsRestModalOpen(true);
              }}
              className="bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-brandCard flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Local
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest) => (
              <div 
                key={rest.id} 
                className="bg-brand-card border border-brand-borderCard rounded-card overflow-hidden shadow-brandCard flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="h-40 w-full relative">
                  <img
                    src={rest.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#202124]/75 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    ID: {rest.id}
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-5 flex-grow space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-brandText-title">{rest.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-brandText-body mt-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{rest.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brandText-body mt-1.5">
                      <Utensils className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{rest.foodType}</span>
                    </div>
                  </div>

                  {/* Owner link info */}
                  <div className="bg-brand-bg border border-brand-border rounded-xl p-3">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-brand-accent shrink-0" />
                      <span className="text-xs font-bold text-brandText-subtitle">Propietario Asignado:</span>
                    </div>
                    <p className="text-[11px] text-brandText-body mt-1 font-semibold">
                      {(rest as any).owner ? (
                        <>
                          {(rest as any).owner.name} <br/>
                          <span className="text-[10px] text-brandText-disabled">{(rest as any).owner.email}</span>
                        </>
                      ) : (
                        <span className="text-brand-error font-medium italic">Sin dueño asignado</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 py-4 border-t border-brand-border bg-slate-50 flex gap-2">
                  <button
                    onClick={() => handleOpenEditRest(rest)}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-brand-border text-brandText-subtitle rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(rest.id)}
                    className="flex-1 py-2 bg-white hover:bg-brand-error/10 border border-brand-border hover:border-brand-error/20 text-brand-error rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. USUARIOS (USERS) TAB */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-brand-card border border-brand-borderCard rounded-card p-6 shadow-brandCard">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-brandText-title flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-primary" />
                  Gestión de Cuentas de Negocio (Dueños/Administradores)
                </h2>
                <p className="text-brandText-body text-xs mt-1">
                  Listado global de dueños de locales y administradores. Los clientes no figuran en esta sección.
                </p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="p-2.5 bg-brand-bg hover:bg-brand-border border border-brand-border text-brandText-body rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-brandText-subtitle text-sm">Cargando cuentas...</span>
            </div>
          ) : (
            <div className="bg-brand-card border border-brand-borderCard rounded-card shadow-brandCard overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-brand-border text-brandText-subtitle uppercase font-extrabold tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Rol</th>
                      <th className="px-6 py-4">Local Asociado</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-brandText-body">
                    {filteredUsers.map((user) => {
                      const isOwner = user.role === 'OWNER';
                      const isAdmin = user.role === 'ADMIN';
                      const assignedRest = restaurants.find(r => (r as any).ownerId === user.id);

                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-brandText-title">#{user.id}</td>
                          <td className="px-6 py-4 font-semibold text-brandText-title">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isAdmin 
                                ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' 
                                : 'bg-orange-50 border border-orange-200 text-orange-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-brandText-subtitle">
                            {assignedRest ? (
                              <span className="text-brandText-title">{assignedRest.name}</span>
                            ) : isOwner ? (
                              <span className="text-brand-error italic font-medium">Ninguno asignado</span>
                            ) : (
                              <span className="text-brandText-disabled font-medium">Acceso Global</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/20 hover:bg-brand-primary hover:text-white text-brand-primary text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3 shrink-0" />
                              Editar Datos
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* RESTAURANT CREATION/EDITION MODAL */}
      {/* ======================================================== */}
      {isRestModalOpen && (
        <div className="fixed inset-0 bg-[#202124]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-borderCard rounded-card max-w-md w-full p-6 shadow-brandCard animate-fade-in relative">
            <button
              onClick={() => setIsRestModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-brand-bg hover:bg-brand-border text-brandText-subtitle rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-brandText-title mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-primary" />
              {editRest ? 'Editar Datos del Local' : 'Registrar Nuevo Local'}
            </h3>

            {restSuccess && (
              <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{restSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveRestaurant} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Nombre del Local</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Parrilla Don Julio"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Dirección / Ubicación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Palermo, CABA"
                  value={restLocation}
                  onChange={(e) => setRestLocation(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Tipo de Gastronomía</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carnes / Parrilla"
                  value={restFoodType}
                  onChange={(e) => setRestFoodType(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Imagen Foto URL (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={restPhoto}
                  onChange={(e) => setRestPhoto(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary placeholder:text-brandText-disabled"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Asignar Propietario (Dueño)</label>
                <select
                  value={restOwnerId}
                  onChange={(e) => setRestOwnerId(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="">Sin propietario (Dueño vacante)</option>
                  {ownersList.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestModalOpen(false)}
                  className="flex-1 py-2.5 bg-brand-bg hover:bg-brand-border border border-brand-border text-brandText-subtitle rounded-btn text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive text-white rounded-btn text-xs font-bold transition-all shadow-brandCard active:scale-95 cursor-pointer"
                >
                  {editRest ? 'Guardar Cambios' : 'Crear Local'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* USER EDIT MODAL (PASSWORD, NAME, ASSIGNED LOCAL) */}
      {/* ======================================================== */}
      {isUserModalOpen && editUser && (
        <div className="fixed inset-0 bg-[#202124]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-borderCard rounded-card max-w-md w-full p-6 shadow-brandCard animate-fade-in relative">
            <button
              onClick={() => {
                setIsUserModalOpen(false);
                setEditUser(null);
              }}
              className="absolute top-4 right-4 p-1.5 bg-brand-bg hover:bg-brand-border text-brandText-subtitle rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-brandText-title mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              Editar Cuenta: {editUser.name}
            </h3>

            {userSuccess && (
              <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{userSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-brand-primary" />
                    Correo Electrónico
                  </span>
                </label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Rol de Sistema</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="OWNER">OWNER (Propietario / Empleado)</option>
                  <option value="ADMIN">ADMIN (Administrador Global)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-brand-primary" />
                    Nueva Contraseña (Opcional)
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para no modificar"
                  value={editUserPassword}
                  onChange={(e) => setEditUserPassword(e.target.value)}
                  className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary placeholder:text-brandText-disabled"
                />
              </div>

              {editUserRole === 'OWNER' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-brandText-subtitle tracking-wider mb-1.5">Asociar Local Gastronómico</label>
                  <select
                    value={editUserRestId}
                    onChange={(e) => setEditUserRestId(e.target.value)}
                    className="w-full bg-white border border-brand-borderInput text-brandText-title text-xs rounded-input px-4 py-2.5 outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="">Ninguno (Local sin asignar)</option>
                    {restaurants.map((rest) => (
                      <option key={rest.id} value={rest.id}>
                        {rest.name} ({rest.location})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserModalOpen(false);
                    setEditUser(null);
                  }}
                  className="flex-1 py-2.5 bg-brand-bg hover:bg-brand-border border border-brand-border text-brandText-subtitle rounded-btn text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primaryHover active:bg-brand-primaryActive text-white rounded-btn text-xs font-bold transition-all shadow-brandCard active:scale-95 cursor-pointer"
                >
                  Guardar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
