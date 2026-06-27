import * as adService from '../services/adService.js';

export const listActive = async (req, res) => {
  try {
    const list = await adService.getActiveAds();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listRestaurantAds = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const list = await adService.getRestaurantAds(parseInt(req.params.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { restaurantId, title, image, redirectUrl, isActive } = req.body;
  if (!restaurantId || !title || !image) {
    return res.status(400).json({ error: 'Faltan detalles del anuncio' });
  }
  try {
    const ad = await adService.createAd(restaurantId, title, image, redirectUrl, isActive);
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleState = async (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const ad = await adService.toggleAdState(parseInt(req.params.id));
    res.json(ad);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
