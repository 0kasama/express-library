import express from 'express';
import bookRoute from './bookRoute.js';
import memberRoute from './memberRoute.js';
import borrowingRoute from './borrowingRoute.js';

const router = express.Router();

router.use('/api/', bookRoute);
router.use('/api/', memberRoute);
router.use('/api/', borrowingRoute);

export default router;
