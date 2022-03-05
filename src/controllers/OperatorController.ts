import pool from '../db/dbconnector';
import { getAllTransactions } from '../db/queries';

class OperatorController {
  public async getBalance(req, res) {
    try {
      const client = await pool.connect();      
      const { rows : transactions }  = await client.query(getAllTransactions);

      client.release();

      res.status(200).send(transactions);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

export default OperatorController;