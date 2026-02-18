import { Router } from 'express';
import * as sucursalController from '../controllers/sucursal.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de sucursales están protegidas
router.use(authenticateToken);

router.get('/', sucursalController.getSucursales); // Ver sucursales (Cualquier autenicado por ahora)

router.post('/', authorizePermission('manage_branches'), sucursalController.createSucursal);
router.delete('/:id', authorizePermission('manage_branches'), sucursalController.deleteSucursal);

export default router;
