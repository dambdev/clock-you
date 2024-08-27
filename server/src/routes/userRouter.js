import express from 'express';

import authUser from '../middleware/authUser.js';
import isAdmin from '../middleware/isAdmin.js';
import userExists from '../middleware/userExists.js';

import {
    registerUserController,
    validateUserController,
    loginUserController,
    changeUserPasswordController,
    sendRecoverPasswordCodeController,
    registerUserAdminController,
    editUserController,
    getEmployeeController,
    listEmployeeController,
    deleteUserController,
    editUserAvatarController,
} from '../controllers/users/index.js';

const router = express.Router();

router.get('/users/validate/:registrationCode', validateUserController);

router.get('/users/employee', authUser, isAdmin, listEmployeeController);

router.get(
    '/users/employee/:employeeId',
    authUser,
    isAdmin,
    userExists,
    getEmployeeController
);

router.post('/users/register', registerUserController);

router.post('/users/login', loginUserController);

router.post('/users/password/recover', sendRecoverPasswordCodeController);

router.post(
    '/users/admin/register',
    authUser,
    isAdmin,
    registerUserAdminController
);

router.post(
    '/users/avatar/:userId',
    authUser,
    userExists,
    editUserAvatarController
);

router.put('/users/:userId', authUser, userExists, editUserController);

router.patch('/users/password', changeUserPasswordController);

router.delete('/users/:userId', authUser, userExists, deleteUserController);

export default router;
