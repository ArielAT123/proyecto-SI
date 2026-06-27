import * as adminService from '../services/adminService.js';

export const getMetrics = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere perfil administrador.' });
  }
  try {
    const { restaurantId } = req.query;
    const metrics = await adminService.getAdminMetrics(restaurantId ? parseInt(restaurantId) : null);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
