import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.use(authorizePermission('reports_view'));

router.get('/dashboard', reportController.getDashboardStats);
router.get('/branches', reportController.getBranchReports);
router.get('/types', reportController.getTypeStats);

export default router;
