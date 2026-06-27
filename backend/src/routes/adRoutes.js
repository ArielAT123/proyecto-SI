import express from 'express';
import * as adController from '../controllers/adController.js';
import { auth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/ads', adController.listActive);
router.get('/restaurants/:id/ads', auth, adController.listRestaurantAds);
router.post('/ads', auth, uploadImage, adController.create);
router.patch('/ads/:id/toggle', auth, adController.toggleState);

export default router;
