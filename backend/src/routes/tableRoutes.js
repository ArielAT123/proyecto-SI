import express from 'express';
import * as tableController from '../controllers/tableController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/restaurants/:id/tables', auth, tableController.create);
router.delete('/tables/:id', auth, tableController.remove);
router.patch('/tables/:id/status', auth, tableController.updateStatus);

export default router;
