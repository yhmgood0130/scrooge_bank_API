import express, { Router } from 'express';
import LoginController from '../controllers/LoginControllers';

const router = Router();
const authController = new LoginController();

router.post('/login', authController.login);

export default router;