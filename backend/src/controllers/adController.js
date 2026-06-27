import * as adService from '../services/adService.js';
import { v2 as cloudinary } from 'cloudinary';

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
  const parsedRestId = parseInt(restaurantId);

  if (!parsedRestId || !title) {
    return res.status(400).json({ error: 'Faltan detalles del anuncio (ID Restaurante o Título)' });
  }

  try {
    let imageUrl = image || '';

    // If a physical image file was uploaded
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: 'image',
          folder: 'aforogo_ads'
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'Debe proporcionar una imagen (archivo o URL)' });
    }

    const activeBool = isActive === 'true' || isActive === true;

    const ad = await adService.createAd(parsedRestId, title, imageUrl, redirectUrl || null, activeBool);
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
