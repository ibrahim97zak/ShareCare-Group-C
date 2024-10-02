// routes/userRoutes.js

import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { validateCreateUser, validateUpdateUser } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/', validateCreateUser, createUser);

router.get('/', getUsers);

router.get('/:id', validateUpdateUser, getUserById);

router.put('/:id', validateUpdateUser, updateUser);

router.delete('/:id', validateUpdateUser, deleteUser);

export default router;
