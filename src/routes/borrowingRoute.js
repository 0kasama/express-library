import express from 'express';
import * as borrow from '../controllers/borrowingController.js';

const router = express.Router();

router.get('/borrowings', borrow.getAllBorrows);
router.post('/borrowings', borrow.createBorrow);

export default router;
