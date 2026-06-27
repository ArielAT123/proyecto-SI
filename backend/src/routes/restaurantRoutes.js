import express from 'express';
import * as restaurantController from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', restaurantController.listAll);
router.get('/:id', restaurantController.getDetail);

export default router;
