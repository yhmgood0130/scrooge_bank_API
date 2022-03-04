
const getAllCustomers: string = "SELECT * FROM customers";
const getCustomersById: string = "SELECT * FROM customers WHERE customer_id = $1";
const getAccount: string = "SELECT * FROM bank_account WHERE customer_id = $1";
const createAccount : string = "INSERT INTO customers(first_name, last_name, email, password) VALUES ($1, $2, $3, $4)";
const closeAccount : string = "UPDATE customers SET status = 'Closed' WHERE customer_id = $1";
const getCustomerByEmail : string = "SELECT * from customers INNER JOIN bank_account ON bank_account.customer_id = customers.customer_id WHERE email = $1";
const openNewAccount : string = "INSERT INTO customers(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
const getAllTransactions: string = "SELECT * from transactions";
const deposit : string = "INSERT INTO transactions(account_id,transaction_type,transaction_amount, transaction_timestamp) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0)) RETURNING *";
const withdraw : string = "INSERT INTO transactions(account_id,transaction_type,transaction_amount, transaction_timestamp) SELECT $1, $2, $3, to_timestamp($4 / 1000.0) WHERE (SELECT SUM(transaction_amount)::money from transactions WHERE account_id = $1) + ($3) >= 0::money RETURNING *";
const getAvailableLoan: string = `SELECT SUM(CASE WHEN transaction_type != 'Loan' THEN transaction_amount::numeric ELSE 0::numeric END) * 0.25 +
SUM(CASE WHEN transaction_type = 'Loan' THEN transaction_amount::numeric ELSE 0::numeric END) AS loan_total
FROM transactions
UNION ALL
SELECT COALESCE(SUM(loan_amount),0)
FROM loan`
const applyLoan : string = 'INSERT INTO loan(customer_id, loan_amount) VALUES ($1,$2)';
const loanPayment : string = 'INSERT INTO loan_payment (loan_id, customer_id, payment_amount, date) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))';
export {
  getAllCustomers,
  getCustomersById,
  getAccount,
  createAccount,
  closeAccount,
  getCustomerByEmail,
  openNewAccount,
  getAvailableLoan,
  getAllTransactions,
  deposit,
  withdraw,
  applyLoan,
  loanPayment
}
