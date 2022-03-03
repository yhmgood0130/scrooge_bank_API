import pool from '../dbconfig/dbconnector';
import { hashPassword, generateJWT, comparePassword } from '../utils/auth';
const queries = require('../dbconfig/queries');

class CustomerController {
  public async get(req, res) {
    try {
      const client = await pool.connect();      
      const { rows }  = await client.query(queries.getAllCustomers());
      const customers = rows;      

      client.release();

      res.send(customers);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async getById(req, res) {
    try {
      const client = await pool.connect();
      const id = req.params.id;  
      const { rows }  = await client.query(queries.getCustomersById(), [id]);
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
      const id = req.params.id;  
      const { rows }  = await client.query(queries.getAccount(), [id]);
      const customers = rows;      
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async login(req, res) {
    try {
      const client = await pool.connect();
      const { email, password } = req.body;
      const { rows }  = await client.query("SELECT customer_id, email, password from customers WHERE email = $1", [email]);
      
      if (rows.length === 0) {
        throw new Error('Incorrect email or password');
      }
      const validUser = await comparePassword(password, rows[0]);
      const token = await generateJWT(validUser);      
      
      res.json({ data:token });
    } catch (error) {            
      res.status(400).send({ message: error.message });               
    }
  }

  public async createAccount(req, res) {
    try {
      const client = await pool.connect();      
      const  { rows }    = await client.query("SELECT * FROM customers WHERE email = $1", [req.body.email]);
      
      if (rows.length === 0) {
        const body = await hashPassword(req.body);      
        const { firstName, lastName, email, password } = body;  
        const { rows }  = await client.query("INSERT INTO customers(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [firstName, lastName, email, password]);
        const token = await generateJWT(rows[0]);      
    
        client.release();
    
        res.json({ data:token });
      } else {
        res.json({error: 'Email already in use'});
      }
    } catch (error) {
      res.status(400).send(error);      
    }
  }

  public async closeAccount(req, res) {
    try {
      const client = await pool.connect();
      const { id } = req.params;
      const { rows }  = await client.query(queries.closeAccount, [id]);
      const customers = rows;      
  
      client.release();
  
      res.send(customers);
    } catch (error) {
      res.status(400).send(error);      
    }
  }
}


export default CustomerController;