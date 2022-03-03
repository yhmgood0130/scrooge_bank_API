import express, { Router } from 'express';
import BankController from '../controllers/CustomerControllers';
import { authorize } from '../utils/auth';

const router = Router();
const bankController = new BankController();

router.get('/customers', bankController.get);
router.post('/customers', bankController.createAccount);
router.post('/login', bankController.login);
router.get('/customers/:id', authorize, bankController.getById);
router.put('/customers/:id', authorize, bankController.closeAccount);
router.get('/customers/:id/account', authorize, bankController.getAccount);

export default router;