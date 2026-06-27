import express from 'express';
import * as restaurantController from '../controllers/restaurantController.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, restaurantController.listAll);
router.get('/:id', restaurantController.getDetail);

// Admin-only endpoints
router.post('/', auth, restaurantController.create);
router.put('/:id', auth, restaurantController.update);
router.delete('/:id', auth, restaurantController.remove);

export default router;
