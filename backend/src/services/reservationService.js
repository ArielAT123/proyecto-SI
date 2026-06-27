import prisma from './db.js';
import { broadcastTableUpdate } from './socketService.js';

export const createReservation = async (io, userId, tableId, startTime, cost) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) throw new Error('Usuario no encontrado');

    const table = await tx.table.findUnique({ where: { id: parseInt(tableId) } });
    if (!table) throw new Error('Mesa no encontrada');
    if (table.status !== 'AVAILABLE') throw new Error('La mesa ya está ocupada');

    if (user.balance < parseFloat(cost)) {
      throw new Error('Saldo insuficiente en la billetera virtual');
    }

    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { balance: { decrement: parseFloat(cost) } },
    });

    const updatedTable = await tx.table.update({
      where: { id: table.id },
      data: { status: 'OCCUPIED' },
    });

    const reservation = await tx.reservation.create({
      data: {
        userId: user.id,
        tableId: table.id,
        startTime,
        cost: parseFloat(cost),
      },
      include: {
        table: {
          include: { restaurant: true },
        },
      },
    });

    return { reservation, updatedUser, updatedTable };
  });

  await broadcastTableUpdate(io, result.updatedTable.restaurantId);
  return result;
};
