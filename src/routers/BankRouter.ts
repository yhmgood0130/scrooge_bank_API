import express, { Router } from 'express';
import CreditCardController from '../controllers/CreditCardController';
import BankController from '../controllers/CustomerControllers';
import LoanController from '../controllers/LoanControllers';
import OperatorController from '../controllers/OperatorController';
import { authorize, authorizeAccount } from '../utils/auth';

const router = Router();
const operatorController = new OperatorController();
const bankController = new BankController();
const loanController = new LoanController();
const creditCardController = new CreditCardController();

router.get('/transactions', operatorController.getBalance);

router.post('/customers', bankController.createAccount);
router.get('/customers/:id', authorize, bankController.getById);
router.put('/customers/:id', authorize, bankController.closeAccount);
router.get('/customers/:id/account', authorize, bankController.getAccount);
router.post('/customers/:id/account/deposit', authorizeAccount, bankController.deposit);
router.post('/customers/:id/account/withdraw', authorizeAccount, bankController.withdraw);

router.get('/loan', loanController.getBalance);
router.post('/loan', loanController.applyLoan);
router.post('/loan/:id', loanController.loanPayment);

router.post('/creditcard', creditCardController.applyCreditCard);

export default router;