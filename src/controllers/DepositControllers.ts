import pool from '../dbconfig/dbconnector';

class DepositController {
  public async get(req, res) {
    try {
      const client = await pool.connect();

      const sql = "SELECT * FROM transactions";
      const rows2  = await client.query(sql);
      console.log(rows2);
      
      const { rows } = rows2;
      const todos = rows;

      console.log(todos);
      

      client.release();

      res.send(todos);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default DepositController;