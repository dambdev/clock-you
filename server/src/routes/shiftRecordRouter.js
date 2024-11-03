import express from 'express';
import isAdmin from '../middleware/isAdmin.js';
import authUser from '../middleware/authUser.js';
import isEmployee from '../middleware/isEmployee.js';
import serviceExists from '../middleware/serviceExists.js';
import shiftRecordExists from '../middleware/shiftRecordExists.js';

import {
    newShiftRecordController,
    editShiftRecordController,
    listShiftRecordsController,
    exitShiftRecordsController,
    detailShiftRecordController,
    startShiftRecordsController,
    deleteShiftRecordController,
} from '../controllers/shiftRecords/index.js';

const router = express.Router();

router.get('/shiftRecords', authUser, isAdmin, listShiftRecordsController);

router.get(
    '/shiftRecords/:shiftRecordId',
    authUser,
    shiftRecordExists,
    detailShiftRecordController
);

router.post(
    '/shiftRecords/:serviceId',
    authUser,
    isAdmin,
    serviceExists,
    newShiftRecordController
);

router.put('/shiftRecords', authUser, isEmployee, startShiftRecordsController);

router.put(
    '/shiftRecords/edit/:shiftRecordId',
    authUser,
    isAdmin,
    shiftRecordExists,
    editShiftRecordController
);

router.patch('/shiftRecords', authUser, isEmployee, exitShiftRecordsController);

router.delete(
    '/shiftRecords/:shiftRecordId',
    authUser,
    isAdmin,
    shiftRecordExists,
    deleteShiftRecordController
);

export default router;
