import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed database...');

  // 1. Clean existing records
  await prisma.reservation.deleteMany({});
  await prisma.ad.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // Default hashed password for testing
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create Users
  const client1 = await prisma.user.create({
    data: {
      email: 'juan@cliente.com',
      name: 'Juan Pérez',
      password: hashedPassword,
      role: 'CLIENT',
      balance: 150.00,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'maria@cliente.com',
      name: 'María López',
      password: hashedPassword,
      role: 'CLIENT',
      balance: 15.00, // low balance to test wallet validation
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: 'dueno@restaurante.com',
      name: 'Carlos Julio (Dueño)',
      password: hashedPassword,
      role: 'OWNER',
      balance: 0.00,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@sistema.com',
      name: 'Administrador Principal',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 0.00,
    },
  });

  console.log('Users created.');

  // 3. Create Restaurants
  const rest1 = await prisma.restaurant.create({
    data: {
      name: 'Parrilla Don Julio',
      location: 'Palermo, CABA',
      foodType: 'Carnes / Parrilla',
      photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id,
    },
  });

  const rest2 = await prisma.restaurant.create({
    data: {
      name: 'Pizzería Güerrín',
      location: 'Av. Corrientes, CABA',
      foodType: 'Pizzas / Empanadas',
      photo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id,
    },
  });

  const rest3 = await prisma.restaurant.create({
    data: {
      name: 'Sarkis',
      location: 'Villa Crespo, CABA',
      foodType: 'Comida Armenia / Oriente Medio',
      photo: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id,
    },
  });

  console.log('Restaurants created.');

  // 4. Create Tables for Parrilla Don Julio
  await prisma.table.createMany({
    data: [
      { restaurantId: rest1.id, number: 1, capacity: 2, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=300&q=80' },
      { restaurantId: rest1.id, number: 2, capacity: 2, status: 'OCCUPIED', preview: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=300&q=80' },
      { restaurantId: rest1.id, number: 3, capacity: 4, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80' },
      { restaurantId: rest1.id, number: 4, capacity: 4, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80' },
      { restaurantId: rest1.id, number: 5, capacity: 6, status: 'OCCUPIED', preview: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80' },
    ],
  });

  // Create Tables for Pizzería Güerrín
  await prisma.table.createMany({
    data: [
      { restaurantId: rest2.id, number: 1, capacity: 2, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=300&q=80' },
      { restaurantId: rest2.id, number: 2, capacity: 4, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80' },
      { restaurantId: rest2.id, number: 3, capacity: 4, status: 'OCCUPIED', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80' },
      { restaurantId: rest2.id, number: 4, capacity: 6, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80' },
    ],
  });

  // Create Tables for Sarkis
  await prisma.table.createMany({
    data: [
      { restaurantId: rest3.id, number: 1, capacity: 2, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=300&q=80' },
      { restaurantId: rest3.id, number: 2, capacity: 2, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=300&q=80' },
      { restaurantId: rest3.id, number: 3, capacity: 4, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80' },
      { restaurantId: rest3.id, number: 4, capacity: 8, status: 'AVAILABLE', preview: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80' },
    ],
  });

  console.log('Tables created.');

  // 5. Create Ads for banner
  await prisma.ad.create({
    data: {
      restaurantId: rest1.id,
      title: '¡20% OFF en Asado Especial de Tira los días Martes!',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      redirectUrl: `/restaurant/${rest1.id}`,
      isActive: true,
    },
  });

  await prisma.ad.create({
    data: {
      restaurantId: rest2.id,
      title: 'La famosa Fugazzeta Rellena de Güerrín - ¡Pídela para llevar o reserva tu mesa!',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      redirectUrl: `/restaurant/${rest2.id}`,
      isActive: true,
    },
  });

  // 6. Create some historical reservations to populate admin dashboard
  // We'll create reservations for user Juan Pérez
  const tDonJulio2 = await prisma.table.findFirst({
    where: { restaurantId: rest1.id, number: 2 },
  });
  const tDonJulio5 = await prisma.table.findFirst({
    where: { restaurantId: rest1.id, number: 5 },
  });
  const tGuerrin3 = await prisma.table.findFirst({
    where: { restaurantId: rest2.id, number: 3 },
  });

  if (tDonJulio2 && tDonJulio5 && tGuerrin3) {
    await prisma.reservation.createMany({
      data: [
        {
          userId: client1.id,
          tableId: tDonJulio2.id,
          startTime: '12:00',
          cost: 25.00,
          createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        },
        {
          userId: client1.id,
          tableId: tDonJulio5.id,
          startTime: '20:00',
          cost: 40.00,
          createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        },
        {
          userId: client2.id,
          tableId: tGuerrin3.id,
          startTime: '13:00',
          cost: 20.00,
          createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
        },
      ],
    });
  }

  console.log('Historical reservations created.');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
