import pool from '../dbconfig/dbconnector';
import { getAllTransactions } from '../dbconfig/queries';

class OperatorController {
  public async getBalance(req, res) {
    try {
      const client = await pool.connect();      
      const { rows }  = await client.query(getAllTransactions);

      const client2 = rows;

      client.release();

      res.status(200).send(client2);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default OperatorController;