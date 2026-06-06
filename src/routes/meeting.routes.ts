import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createMeeting, getMeeting, listMeetings, analyzeMeetingController } from '../controllers/meeting.controller';

const router = Router();
router.use(authenticate);
router.post('/', createMeeting);
router.get('/', listMeetings);
router.get('/:id', getMeeting);
router.post('/:id/analyze', analyzeMeetingController);
export default router;