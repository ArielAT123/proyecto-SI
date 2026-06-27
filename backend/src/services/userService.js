import prisma from './db.js';

export const listAllUsers = async () => {
  return prisma.user.findMany({
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
