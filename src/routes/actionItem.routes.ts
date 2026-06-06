import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createActionItem, updateStatus, listActionItems, getOverdue } from '../controllers/actionItem.controller';

const router = Router();
router.use(authenticate);
router.post('/', createActionItem);
router.get('/overdue', getOverdue);
router.get('/', listActionItems);
router.patch('/:id/status', updateStatus);
export default router;