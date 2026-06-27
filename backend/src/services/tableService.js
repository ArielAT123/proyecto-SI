import prisma from './db.js';
import { broadcastTableUpdate } from './socketService.js';

export const addTable = async (io, restaurantId, number, capacity) => {
  const table = await prisma.table.create({
    data: {
      restaurantId: parseInt(restaurantId),
      number: parseInt(number),
      capacity: parseInt(capacity),
      status: 'AVAILABLE',
    },
  });

  await broadcastTableUpdate(io, restaurantId);
  return table;
};

export const deleteTable = async (io, tableId) => {
  const table = await prisma.table.findUnique({
    where: { id: tableId },
  });
  if (!table) throw new Error('Mesa no encontrada');

  await prisma.table.delete({
    where: { id: tableId },
  });

  await broadcastTableUpdate(io, table.restaurantId);
  return { message: 'Mesa eliminada con éxito', restaurantId: table.restaurantId };
};

export const updateTableStatus = async (io, tableId, status) => {
  const table = await prisma.table.update({
    where: { id: tableId },
    data: { status },
  });

  await broadcastTableUpdate(io, table.restaurantId);
  return table;
};
