import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import restaurantRoutes from './restaurantRoutes.js';
import tableRoutes from './tableRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import adRoutes from './adRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

// Mount table and ad routes which use overlapping base structures
router.use('/', tableRoutes);
router.use('/', adRoutes);

export default router;
