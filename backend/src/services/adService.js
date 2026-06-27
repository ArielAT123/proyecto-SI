import prisma from './db.js';

export const getActiveAds = async () => {
  return prisma.ad.findMany({
    where: { isActive: true },
    include: { restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getRestaurantAds = async (restaurantId) => {
  return prisma.ad.findMany({
    where: { restaurantId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createAd = async (restaurantId, title, image, redirectUrl, isActive) => {
  return prisma.ad.create({
    data: {
      restaurantId,
      title,
      image,
      redirectUrl,
      isActive: isActive !== undefined ? isActive : true,
    },
  });
};

export const toggleAdState = async (adId) => {
  const currentAd = await prisma.ad.findUnique({
    where: { id: adId },
  });
  if (!currentAd) throw new Error('Anuncio no encontrado');

  return prisma.ad.update({
    where: { id: adId },
    data: { isActive: !currentAd.isActive },
  });
};
