import express from 'express';
import * as borrow from '../controllers/borrowingController.js';

const router = express.Router();

router.post('/borrowings', borrow.createBorrow);
router.put('/borrowings/:id/return', borrow.updateBorrow);

export default router;
