import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

// Login es público
router.post('/login', authController.login);

// Registro de nuevos usuarios requiere permiso de administrador
router.post('/register', authenticateToken, authorizePermission('manage_users'), authController.register);

export default router;
