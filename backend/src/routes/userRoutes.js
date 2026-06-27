import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, userController.listUsers);
router.get('/:id', auth, userController.getUserDetails);
router.post('/:id/recharge', auth, userController.rechargeWallet);
router.put('/:id', auth, userController.updateUser);

export default router;
