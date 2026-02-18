import { Router } from 'express';
import * as lavadoraController from '../controllers/lavadora.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('washers_view'), lavadoraController.getLavadoras);
router.post('/', authorizePermission('washers_create'), lavadoraController.createLavadora);
router.post('/:id/toggle', authorizePermission('washers_toggle'), lavadoraController.toggleLavadora);

export default router;
