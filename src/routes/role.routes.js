import { Router } from 'express';
import * as roleController from '../controllers/role.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('roles_view'), roleController.getRoles);
router.post('/', authorizePermission('roles_create'), roleController.createRole);
router.put('/:id', authorizePermission('roles_edit'), roleController.updateRole);
router.delete('/:id', authorizePermission('roles_delete'), roleController.deleteRole);

export default router;
