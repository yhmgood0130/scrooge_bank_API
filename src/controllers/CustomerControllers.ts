import pool from '../dbconfig/dbconnector';
import { hashPassword, generateJWT, comparePassword } from '../utils/auth';
import { getCustomerByEmail, getCustomersById, getAccount, openNewAccount, closeAccount, withdraw, deposit } from '../dbconfig/queries';

class CustomerController {
  public async getById(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;  
      const { rows }  = await client.query(getCustomersById, [id]);
      const customers = rows;      
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async getAccount(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;
      const { rows }  = await client.query(getAccount, [id]);
      const customers = rows;      
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async createAccount(req, res) {
    try {
      const client = await pool.connect();      
      const  { rows } = await client.query("SELECT * from customers WHERE email = $1", [req.body.email]);
      
      if (rows.length === 0) {
        
        const body = await hashPassword(req.body);      
        const { firstName, lastName, email, password } = body;  
        const { rows }  = await client.query(openNewAccount, [firstName, lastName, email, password]);
        const newCustomerAccount = await client.query(getAccount, [rows[0].customer_id]);
        rows[0].account_id = newCustomerAccount.rows[0]?.account_id;
        
        const token = await generateJWT(rows[0]);      
    
        client.release();
    
        res.json({ data:token });
      } else {
        throw new Error('Email already in use');
      }
    } catch (error) {
      res.status(400).send(error);      
    }
  }

  public async closeAccount(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;
      const { rows }  = await client.query(closeAccount, [id]);
      const account = rows;      
  
      client.release();
  
      res.send(account);
    } catch (error) {
      res.status(400).send(error);      
    }
  }

  public async transaction(req, res) {
    try {
      const client = await pool.connect();
      const { account_id, transaction_amount, transaction_type } = req.body;
      let transaction = null;

      if (transaction_type === 'deposit') {
        if (transaction_amount <= 0) 
          throw new Error("Amount cannot be or below 0.");
          
        const { rows }  = await client.query(deposit, [account_id, transaction_type, transaction_amount, Date.now()]);        
        transaction = rows;
      } else if (transaction_type === 'withdraw') {
        if (transaction_amount >= 0)
          throw new Error("Amount cannot be or above 0.");
        
          const { rows }  = await client.query(withdraw, [account_id, transaction_type, transaction_amount, Date.now()]);
          transaction = rows;

          if (transaction.length === 0) {
            throw new Error("Invalid withdraw. Please enter the valid amount.");
          }
      }
      
      client.release();

      res.send(transaction);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }  
}


export default CustomerController;