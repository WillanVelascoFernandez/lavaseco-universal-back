import { Router } from 'express';
import * as sucursalController from '../controllers/sucursal.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('branches_view'), sucursalController.getSucursales);
router.post('/', authorizePermission('branches_create'), sucursalController.createSucursal);
router.delete('/:id', authorizePermission('branches_delete'), sucursalController.deleteSucursal);

export default router;
