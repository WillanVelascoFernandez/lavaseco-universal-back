import { Router } from 'express';
import * as branchController from '../controllers/branch.controller.js';
import { authenticateToken, authorizePermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizePermission('branches_view'), branchController.getBranches);
router.post('/', authorizePermission('branches_create'), branchController.createBranch);
router.put('/:id', authorizePermission('branches_edit'), branchController.updateBranch);
router.delete('/:id', authorizePermission('branches_delete'), branchController.deleteBranch);

export default router;
