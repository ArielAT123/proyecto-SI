import * as restaurantService from '../services/restaurantService.js';

export const listAll = async (req, res) => {
  try {
    const ownerId = req.user && req.user.role === 'OWNER' ? req.user.id : null;
    const list = await restaurantService.listRestaurants(ownerId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetail = async (req, res) => {
  try {
    const detail = await restaurantService.getRestaurantDetail(parseInt(req.params.id));
    res.json(detail);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
  }
  const { name, location, photo, foodType, ownerId } = req.body;
  if (!name || !location || !foodType) {
    return res.status(400).json({ error: 'Nombre, ubicación y tipo de comida son requeridos' });
  }
  try {
    const newRest = await restaurantService.createRestaurant({
      name,
      location,
      photo: photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      foodType,
      ownerId: ownerId ? parseInt(ownerId) : null,
    });
    res.status(201).json(newRest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
  }
  const { name, location, photo, foodType, ownerId } = req.body;
  try {
    const updated = await restaurantService.updateRestaurant(parseInt(req.params.id), {
      name,
      location,
      photo,
      foodType,
      ownerId: ownerId !== undefined ? (ownerId ? parseInt(ownerId) : null) : undefined,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
  }
  try {
    const result = await restaurantService.deleteRestaurant(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
