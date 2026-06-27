import * as reservationService from '../services/reservationService.js';

export const create = async (req, res) => {
  const { userId, tableId, startTime, cost } = req.body;

  if (!userId || !tableId || !startTime || cost === undefined) {
    return res.status(400).json({ error: 'Faltan detalles de la reserva' });
  }

  if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. No puedes reservar para otro usuario.' });
  }

  try {
    const result = await reservationService.createReservation(req.io, userId, tableId, startTime, cost);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
