import prisma from './db.js';

export const broadcastTableUpdate = async (io, restaurantId) => {
  if (!io) return;
  try {
    const tables = await prisma.table.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      orderBy: { number: 'asc' },
    });
    
    const availableCount = tables.filter(t => t.status === 'AVAILABLE').length;

    io.emit('table_update', {
      restaurantId: parseInt(restaurantId),
      tables,
      availableCount,
    });
  } catch (error) {
    console.error('Error broadcasting update:', error);
  }
};
