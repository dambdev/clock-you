import express from 'express';
import userRouter from './userRouter.js';
import serviceRouter from './serviceRouter.js';
import shiftRecordRouter from './shiftRecordRouter.js';
import typeOfServiceRouter from './typeOfServiceRouter.js';

const router = express.Router();

router.use(userRouter);
router.use(serviceRouter);
router.use(shiftRecordRouter);
router.use(typeOfServiceRouter);

export default router;
