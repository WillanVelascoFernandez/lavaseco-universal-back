import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('users_view'), userController.getUsers);
router.put('/:id', authorizePermission('users_edit'), userController.updateUser);
router.delete('/:id', authorizePermission('users_delete'), userController.deleteUser);

export default router;
