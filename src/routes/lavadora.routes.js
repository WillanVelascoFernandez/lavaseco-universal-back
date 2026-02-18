import { Router } from 'express';
import * as lavadoraController from '../controllers/lavadora.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas protegidas
router.use(authenticateToken);

router.get('/', lavadoraController.getLavadoras);

// Solo operadores o admins pueden crear o accionar lavadoras
router.post('/', authorizePermission('manage_branches'), lavadoraController.createLavadora);
router.post('/:id/toggle', authorizePermission('operate_machines'), lavadoraController.toggleLavadora);

export default router;
