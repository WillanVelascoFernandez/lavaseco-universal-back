import { Router } from 'express';
import * as sucursalController from '../controllers/sucursal.controller.js';

const router = Router();

router.get('/', sucursalController.getSucursales);
router.post('/', sucursalController.createSucursal);
router.delete('/:id', sucursalController.deleteSucursal);

export default router;
