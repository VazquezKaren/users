// userRoutes.js

import express from 'express';
import { createUser, getUsers, updateUser, deleteStatus, login } from '../controllers/userController.js';  
const router = express.Router(); 

router.get('/all', getUsers);
router.post('/create', createUser);
router.patch('/:id', updateUser);
router.patch('/:id/status', deleteStatus);
router.post('/login', login);  



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /api/v1/users/all:
 *   get:
 *     summary: Get all Users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A successful response
 */


export default router