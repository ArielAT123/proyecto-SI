const fs = require('fs');

const NUM_RESTAURANTS = 12000;
const TOTAL_RESERVATIONS = 12543; // Gigante
const TOTAL_TABLES = 250000;
const OCCUPIED_TABLES = 180000;
const TOTAL_CLIENTS = 48500;
const TOTAL_EARNINGS = 1254000.50;

const restaurants = Array.from({ length: NUM_RESTAURANTS }, (_, i) => ({
  id: i + 1,
  name: `Restaurante Mock ${i + 1}`,
  location: `Dirección Comercial ${i + 1}, Ciudad Central`,
  foodType: ['Italiana', 'Mexicana', 'Japonesa', 'Carnes', 'Vegana', 'Fusión', 'Peruana', 'Mediterránea', 'Asiática', 'Pizzería'][i % 10],
  photo: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80`
}));

const occupancyByRestaurant = restaurants.map(rest => {
  const total = 25;
  const occupied = Math.floor(Math.random() * 20) + 5;
  return {
    id: rest.id,
    name: rest.name,
    location: rest.location,
    foodType: rest.foodType,
    photo: rest.photo,
    totalTables: total,
    occupiedTables: occupied,
    availableTables: total - occupied,
    occupancyPercentage: Math.round((occupied / total) * 100 * 10) / 10
  };
});

const hourlyData = [];
let remainingReservations = TOTAL_RESERVATIONS;
for (let i = 8; i <= 22; i++) {
  const hour = `${i.toString().padStart(2, '0')}:00`;
  const isPeak = (i >= 13 && i <= 15) || (i >= 19 && i <= 21);
  const count = i === 22 ? remainingReservations : Math.floor((isPeak ? 0.12 : 0.04) * TOTAL_RESERVATIONS + Math.random() * 100);
  remainingReservations -= count;
  hourlyData.push({
    hour,
    count: count,
    percentage: Math.round((count / TOTAL_RESERVATIONS) * 100 * 10) / 10
  });
}

const campaigns = restaurants.slice(0, 4).map((rest, idx) => {
  const platforms = ['Instagram', 'Facebook', 'TikTok', 'Google'];
  const icons = ['instagram', 'facebook', 'tiktok', 'google'];
  const reach = 50000 + Math.floor(Math.random() * 20000);
  const conversions = 2000 + Math.floor(Math.random() * 1000);
  return {
    id: idx + 1,
    title: `Campaña Verano ${rest.name}`,
    restaurantName: rest.name,
    platform: platforms[idx],
    reach: reach,
    conversions: conversions,
    performancePercentage: Math.round((conversions / reach) * 100 * 10) / 10,
    iconType: icons[idx]
  };
});

const dashboardData = {
  // 1. Ocupación
  totalTablesCount: TOTAL_TABLES,
  occupiedTablesCount: OCCUPIED_TABLES,
  availableTablesCount: TOTAL_TABLES - OCCUPIED_TABLES,
  averageOccupancy: Math.round((OCCUPIED_TABLES / TOTAL_TABLES) * 100 * 10) / 10,
  occupancyByRestaurant,
  
  // 2. Horarios
  totalReservations: TOTAL_RESERVATIONS,
  hourlyData,
  
  // 3. Clientes
  totalClientsServed: TOTAL_CLIENTS,
  totalClientsToday: Math.floor(TOTAL_CLIENTS / 30),
  
  // 4. Ingresos
  totalEarnings: TOTAL_EARNINGS,
  
  // 5. Publicidad
  averageAdPerformance: 4.8,
  campaigns,
  
  // Evolución
  evolution: {
    monthly: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      clients: [25000, 27000, 31000, 35000, 39000, 42000, 45000, TOTAL_CLIENTS],
      revenue: [650000, 710000, 820000, 910000, 1050000, 1120000, 1190000, TOTAL_EARNINGS]
    },
    weekly: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      clients: [5000, 5200, 5800, 6100, 6500, 6900, 7100, 7500],
      revenue: [120000, 125000, 135000, 142000, 155000, 161000, 168000, 180000]
    },
    daily: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      clients: [450, 520, 610, 780, 1120, 1450, 1280],
      revenue: [12800, 13200, 14900, 18100, 27800, 32900, 28600]
    }
  },
  
  // Restaurantes para el listado general
  restaurants
};

fs.writeFileSync('mock_dataset.json', JSON.stringify(dashboardData, null, 2));
console.log('Successfully generated dashboard mock_dataset.json');
