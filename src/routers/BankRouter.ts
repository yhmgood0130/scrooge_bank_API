import express, { Router } from 'express';
import CreditCardController from '../controllers/CreditCardController';
import CustomerController from '../controllers/CustomerControllers';
import LoanController from '../controllers/LoanControllers';
import OperatorController from '../controllers/OperatorController';
import { authorize, authorizeAccount } from '../utils/auth';

const router = Router();
const operatorController = new OperatorController();
const customerController = new CustomerController();
const loanController = new LoanController();
const creditCardController = new CreditCardController();

router.get('/transactions', operatorController.getBalance);

router.post('/customers', customerController.createProfile);
router.get('/customers/:id', authorize, customerController.getById);
router.put('/customers/:id', authorize, customerController.closeAccount);
router.get('/customers/:id/account', authorize, customerController.getAccount);
router.post('/customers/:id/account', authorize, customerController.createAccount);
router.post('/customers/:id/account/deposit', authorizeAccount, customerController.deposit);
router.post('/customers/:id/account/withdraw', authorizeAccount, customerController.withdraw);

router.get('/loan', loanController.getBalance);
router.post('/loan', loanController.applyLoan);
router.post('/loan/:id', loanController.loanPayment);

router.post('/creditcard', creditCardController.applyCreditCard);

export default router;