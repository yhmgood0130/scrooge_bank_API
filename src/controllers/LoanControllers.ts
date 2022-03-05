import pool from '../db/dbconnector';
import { getAvailableLoan, applyLoan, loanPayment } from '../db/queries';

class LoanController {
  public async getBalance(req, res) {
    try {
      const client = await pool.connect();      
      const { rows : loan_amounts }  = await client.query(getAvailableLoan);
      const total = loan_amounts[0].loan_total - loan_amounts[1].loan_total;

      client.release();

      res.send({ availableAmount: total });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
  public async applyLoan(req, res) {
    try {
      const client = await pool.connect();
      const { customer_id, loan_amount } = req.body;
      const { rows : loan_amounts }  = await client.query(getAvailableLoan);
      const total = loan_amounts[0].loan_total - loan_amounts[1].loan_total;      
      
      if (loan_amount > total) {
        throw new Error("Loan Application was rejected due to exceeded amount");
      }

      await client.query(applyLoan, [customer_id, loan_amount]);

      client.release();

      res.send({ message: 'Congratulation! Your loan has been approved' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  public async loanPayment(req, res) {
    try {
      const client = await pool.connect();
      const { customer_id, payment_amount } = req.body;
      await client.query(loanPayment, [req.params.id, customer_id, payment_amount, Date.now()]);

      client.release();

      res.send({ message: `Congratulation! Your payment $${payment_amount} has been processed` });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

export default LoanController;