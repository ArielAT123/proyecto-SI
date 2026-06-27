import prisma from './db.js';

export const listRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      tables: true,
    },
    orderBy: { name: 'asc' },
  });

  return restaurants.map(restaurant => {
    const availableTables = restaurant.tables.filter(t => t.status === 'AVAILABLE').length;
    return {
      ...restaurant,
      availableTablesCount: availableTables,
      totalTablesCount: restaurant.tables.length,
    };
  });
};

export const getRestaurantDetail = async (restaurantId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      tables: {
        orderBy: { number: 'asc' },
      },
      ads: true,
    },
  });
  if (!restaurant) {
    throw new Error('Restaurante no encontrado');
  }
  return restaurant;
};
