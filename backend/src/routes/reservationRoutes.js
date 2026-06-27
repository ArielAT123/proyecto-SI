import express from 'express';
import * as reservationController from '../controllers/reservationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, reservationController.create);

export default router;
