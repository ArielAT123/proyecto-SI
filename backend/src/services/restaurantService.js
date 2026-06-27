import prisma from './db.js';

export const listRestaurants = async (ownerId = null) => {
  const whereClause = ownerId ? { ownerId: parseInt(ownerId) } : {};
  const restaurants = await prisma.restaurant.findMany({
    where: whereClause,
    include: {
      tables: true,
      owner: {
        select: { id: true, name: true, email: true }
      }
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
      owner: {
        select: { id: true, name: true, email: true }
      }
    },
  });
  if (!restaurant) {
    throw new Error('Restaurante no encontrado');
  }
  return restaurant;
};

export const createRestaurant = async ({ name, location, photo, foodType, ownerId }) => {
  return prisma.restaurant.create({
    data: {
      name,
      location,
      photo,
      foodType,
      ownerId,
    },
    include: {
      owner: { select: { id: true, name: true, email: true } }
    }
  });
};

export const updateRestaurant = async (id, { name, location, photo, foodType, ownerId }) => {
  return prisma.restaurant.update({
    where: { id },
    data: {
      name,
      location,
      photo,
      foodType,
      ownerId,
    },
    include: {
      owner: { select: { id: true, name: true, email: true } }
    }
  });
};

export const deleteRestaurant = async (id) => {
  await prisma.restaurant.delete({
    where: { id },
  });
  return { message: 'Restaurante eliminado con éxito' };
};
