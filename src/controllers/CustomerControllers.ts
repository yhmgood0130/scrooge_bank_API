import pool from '../db/dbconnector';
import { hashPassword, generateJWT, comparePassword } from '../utils/auth';
import { getCustomersById, getAccount, createProfile, createAccount, closeAccount, withdraw, deposit } from '../db/queries';

class CustomerController {
  public async getById(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;  
      const { rows : customers }  = await client.query(getCustomersById, [id]);    
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  public async getAccount(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;
      const { rows : customers }  = await client.query(getAccount, [id]);
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  public async createProfile(req, res) {
    try {
      const client = await pool.connect();      
      const  { rows : customer } = await client.query("SELECT * from customers WHERE email = $1", [req.body.email]);
      
      if (customer.length === 0) {
        
        const body = await hashPassword(req.body);      
        const { firstName, lastName, email, password } = body;  
        const { rows : newAccount }  = await client.query(createProfile, [firstName, lastName, email, password]);
        
        const token = await generateJWT(newAccount[0]);      
    
        client.release();
    
        res.json({ token, customer_id: newAccount[0].customer_id });
      } else {
        throw new Error('Email already in use');
      }
    } catch (error) {
      res.status(400).send({ error: error.message });      
    }
  }
  public async createAccount(req, res) {
    try {
      const client = await pool.connect();      
      const  { rows : customer } = await client.query("SELECT * from customers WHERE email = $1", [req.body.email]);
      
      if (customer.length === 0) {    
        const { customer_id } = req.body;  
        const { rows : newAccount }  = await client.query(createAccount, [customer_id]);
        
        const token = await generateJWT(newAccount[0]);      
    
        client.release();
    
        res.json({ token, customer_id: newAccount[0].customer_id, account_id: newAccount[0].account_id });
      } else {
        throw new Error('Customer ID does not exists.');
      }
    } catch (error) {
      if (error.message.includes('duplicate')) error.message = 'Current customer already has an open account.';
      res.status(400).send({ error: error.message });      
    }
  }

  public async closeAccount(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;
      const { rows : account }  = await client.query(closeAccount, [id]); 
  
      client.release();
  
      res.status(204).send(account);
    } catch (error) {
      res.status(400).send({ error: error.message });      
    }
  }

  public async deposit(req, res) {
    try {
      const client = await pool.connect();
      const { account_id, transaction_amount, transaction_type } = req.body;

      if (transaction_amount <= 0) throw new Error("Amount cannot be or below 0.");
        
      const { rows : transaction }  = await client.query(deposit, [account_id, transaction_type, transaction_amount, Date.now()]);

      if (transaction.length === 0) throw new Error(`Invalid ${transaction_type}. Please enter the valid amount.`);
      
      client.release();

      res.send(transaction);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }  
  public async withdraw(req, res) {
    try {
      const client = await pool.connect();
      const { account_id, transaction_amount, transaction_type } = req.body;

      if (transaction_amount >= 0) throw new Error("Amount cannot be or above 0.");
      
      const { rows : transaction }  = await client.query(withdraw, [account_id, transaction_type, transaction_amount, Date.now()]);

      if (transaction.length === 0) throw new Error(`Invalid ${transaction_type}. Please enter the valid amount.`);
      
      client.release();

      res.send(transaction);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }  
}


export default CustomerController;