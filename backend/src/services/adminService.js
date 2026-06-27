import prisma from './db.js';

export const getAdminMetrics = async (restaurantId = null) => {
  const tableWhere = restaurantId ? { restaurantId: parseInt(restaurantId) } : {};
  const occupiedTableWhere = restaurantId 
    ? { restaurantId: parseInt(restaurantId), status: 'OCCUPIED' }
    : { status: 'OCCUPIED' };

  const occupiedTables = await prisma.table.findMany({
    where: occupiedTableWhere,
  });
  const totalClientsToday = occupiedTables.reduce((acc, curr) => acc + curr.capacity, 0);

  const reservationWhere = restaurantId 
    ? { table: { restaurantId: parseInt(restaurantId) } }
    : {};
  const reservations = await prisma.reservation.findMany({
    where: reservationWhere,
  });
  const totalEarnings = reservations.reduce((acc, curr) => acc + curr.cost, 0);

  const allTables = await prisma.table.findMany({
    where: tableWhere,
  });
  const totalTables = allTables.length;
  const occupiedCount = allTables.filter(t => t.status === 'OCCUPIED').length;
  const averageOccupancy = totalTables > 0 ? (occupiedCount / totalTables) * 100 : 0;

  const hourlyCounts = {};
  for (let i = 8; i <= 22; i++) {
    const hourStr = `${i.toString().padStart(2, '0')}:00`;
    hourlyCounts[hourStr] = 0;
  }
  
  reservations.forEach(r => {
    if (r.startTime && hourlyCounts[r.startTime] !== undefined) {
      hourlyCounts[r.startTime] += 1;
    }
  });

  const hourlyData = Object.keys(hourlyCounts).map(hour => ({
    hour,
    count: hourlyCounts[hour],
  }));

  return {
    totalClientsToday,
    totalEarnings,
    averageOccupancy: Math.round(averageOccupancy * 10) / 10,
    hourlyData,
  };
};
