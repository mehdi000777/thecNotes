import express from 'express';
import { login, logout, refresh } from '../controllers/authController.js';
import loginLimiter from '../middlewares/loginLimiter.js';

const router = express.Router();

router.post('/', loginLimiter, login);

router.get('/refresh', refresh);

router.post('/logout', logout);

export default router;