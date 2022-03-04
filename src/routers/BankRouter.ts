import express, { Router } from 'express';
import BankController from '../controllers/CustomerControllers';
import LoanController from '../controllers/LoanControllers';
import { authorize, authorizeAccount } from '../utils/auth';

const router = Router();
const bankController = new BankController();
const loanController = new LoanController();

router.post('/customers', bankController.createAccount);
router.get('/customers/:id', authorize, bankController.getById);
router.put('/customers/:id', authorize, bankController.closeAccount);
router.get('/customers/:id/account', authorize, bankController.getAccount);
router.post('/customers/:id/account', authorizeAccount, bankController.transaction);

router.get('/loan', loanController.getBalance);
router.post('/loan', loanController.applyLoan);
router.post('/loan/:id', loanController.loanPayment);

export default router;