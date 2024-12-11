import express from 'express';
import * as member from '../controllers/memberController.js';

const router = express.Router();

router.get('/members', member.getAllMembers);
router.get('/members/:id/borrowings', member.getBorrowsHistory);
router.post('/members', member.createMember);

export default router;
