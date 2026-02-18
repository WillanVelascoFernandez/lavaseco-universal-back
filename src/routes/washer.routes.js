import { Router } from 'express';
import * as washerController from '../controllers/washer.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('washers_view'), washerController.getWashers);
router.post('/', authorizePermission('washers_create'), washerController.createWasher);
router.post('/:id/toggle', authorizePermission('washers_toggle'), washerController.toggleWasher);

export default router;
