import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', auth, adminController.getMetrics);

export default router;
