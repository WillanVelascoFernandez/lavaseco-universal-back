import { Router } from 'express';
import * as secadoraController from '../controllers/secadora.controller.js';

const router = Router();

router.get('/', secadoraController.getSecadoras);
router.post('/', secadoraController.createSecadora);
router.post('/:id/toggle', secadoraController.toggleSecadora);

export default router;
