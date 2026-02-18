import { Router } from 'express';
import * as secadoraController from '../controllers/secadora.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas protegidas
router.use(authenticateToken);

router.get('/', secadoraController.getSecadoras);

router.post('/', authorizePermission('manage_branches'), secadoraController.createSecadora);
router.post('/:id/toggle', authorizePermission('operate_machines'), secadoraController.toggleSecadora);

export default router;
