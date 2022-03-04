import pool from '../dbconfig/dbconnector';
import { hashPassword, generateJWT, comparePassword } from '../utils/auth';
import { getCustomerByEmail } from '../dbconfig/queries';

class LoginController {
  public async login(req, res) {
    try {
      const client = await pool.connect();
      const { email, password } = req.body;
      const { rows }  = await client.query(getCustomerByEmail, [email]);
      
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
}


export default LoginController;