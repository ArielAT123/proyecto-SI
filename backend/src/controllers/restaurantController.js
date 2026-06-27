import * as restaurantService from '../services/restaurantService.js';

export const listAll = async (req, res) => {
  try {
    const list = await restaurantService.listRestaurants();
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
