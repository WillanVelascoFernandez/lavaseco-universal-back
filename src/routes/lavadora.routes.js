import { Router } from 'express';
import * as lavadoraController from '../controllers/lavadora.controller.js';

const router = Router();

router.get('/', lavadoraController.getLavadoras);
router.post('/', lavadoraController.createLavadora);
router.post('/:id/toggle', lavadoraController.toggleLavadora);

export default router;
