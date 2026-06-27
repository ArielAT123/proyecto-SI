import * as tableService from '../services/tableService.js';

export const create = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { number, capacity, preview } = req.body;
  const restaurantId = parseInt(req.params.id);
  if (!number || !capacity) {
    return res.status(400).json({ error: 'Número y capacidad son requeridos' });
  }
  try {
    const table = await tableService.addTable(req.io, restaurantId, number, capacity, preview);
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const result = await tableService.deleteTable(req.io, parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { status } = req.body;
  if (!status || !['AVAILABLE', 'OCCUPIED'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    const table = await tableService.updateTableStatus(req.io, parseInt(req.params.id), status);
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
