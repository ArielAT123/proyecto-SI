import prisma from './db.js';
import bcrypt from 'bcryptjs';

export const listAllUsers = async (role = null) => {
  const whereClause = role ? { role } : {};
  return prisma.user.findMany({
    where: whereClause,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      balance: true,
      createdAt: true,
    },
  });
};

export const rechargeUserWallet = async (userId, amount) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      balance: {
        increment: parseFloat(amount),
      },
    },
  });
  
  const { password, ...safeUser } = user;
  return safeUser;
};

export const updateUserData = async (userId, { name, email, role, password, restaurantId }) => {
  const updateData = {
    name,
    email,
    role,
  };

  if (password && password.trim() !== '') {
    updateData.password = await bcrypt.hash(password, 10);
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  // Handle restaurant assignment
  if (restaurantId !== undefined) {
    // Clear old associations
    await prisma.restaurant.updateMany({
      where: { ownerId: userId },
      data: { ownerId: null },
    });

    // Assign new restaurant if provided
    if (restaurantId) {
      await prisma.restaurant.update({
        where: { id: parseInt(restaurantId) },
        data: { ownerId: userId },
      });
    }
  }

  const { password: _, ...safeUser } = updatedUser;
  return safeUser;
};
