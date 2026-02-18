import { Router } from 'express';
import * as dryerController from '../controllers/dryer.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('dryers_view'), dryerController.getDryers);
router.post('/', authorizePermission('dryers_create'), dryerController.createDryer);
router.post('/:id/toggle', authorizePermission('dryers_toggle'), dryerController.toggleDryer);

export default router;
