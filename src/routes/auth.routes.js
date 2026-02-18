import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);

// Registro requiere permiso específico de creación de usuarios
router.post('/register', authenticateToken, authorizePermission('users_create'), authController.register);

export default router;
