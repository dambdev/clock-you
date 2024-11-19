import express from 'express';
import isAdmin from '../middleware/isAdmin.js';
import authUser from '../middleware/authUser.js';
import userExists from '../middleware/userExists.js';

import {
    getUserController,
    editUserController,
    loginUserController,
    listUsersController,
    deleteUserController,
    registerUserController,
    validateUserController,
    editUserAvatarController,
    getUserProfileController,
    editUserPasswordController,
    registerUserAdminController,
    changeUserPasswordController,
    sendRecoverPasswordCodeController,
    logoutUserController,
} from '../controllers/users/index.js';

const router = express.Router();

router.get('/users/validate/:registrationCode', validateUserController);

router.get('/users', authUser, isAdmin, listUsersController);

router.get('/user', authUser, getUserProfileController);

router.get(
    '/user/admin/:userId',
    authUser,
    isAdmin,
    userExists,
    getUserController
);

router.post('/users/register', registerUserController);

router.post('/users/login', loginUserController);

router.post('/users/logout', logoutUserController);

router.post('/users/password/recover', sendRecoverPasswordCodeController);

router.post(
    '/users/admin/register',
    authUser,
    isAdmin,
    registerUserAdminController
);

router.post(
    '/user/avatar/:userId',
    authUser,
    userExists,
    editUserAvatarController
);

router.patch('/users/password', changeUserPasswordController);

router.put('/user/:userId', authUser, userExists, editUserController);

router.put(
    '/user/password/:userId',
    authUser,
    userExists,
    editUserPasswordController
);

router.delete('/user/:userId', authUser, userExists, deleteUserController);

export default router;
