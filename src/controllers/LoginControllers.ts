import pool from '../db/dbconnector';
import { generateJWT, comparePassword } from '../utils/auth';
import { getCustomerByEmail } from '../db/queries';

class LoginController {
  public async login(req, res) {
    try {
      const client = await pool.connect();
      const { email, password } = req.body;
      const { rows : customer }  = await client.query(getCustomerByEmail, [email]);
      
      if (customer.length === 0) throw new Error('Incorrect email or password');
      
      const validUser = await comparePassword(password, customer[0]);
      const token = await generateJWT(validUser);      
      
      res.json({ token });
    } catch (error) {            
      res.status(400).send({ message: error.message });               
    }
  }  
}


export default LoginController;