module.exports = {
  getAllCustomers: function() {
    return "SELECT * FROM customers";
  },
  getCustomersById: function() {
    return "SELECT * FROM customers WHERE customer_id = $1";
  },
  getAccount: function() {
    return "SELECT * FROM bank_account WHERE customer_id = $1";
  },
  createAccount: function() {
    return "INSERT INTO customers(first_name, last_name, email, password) VALUES ($1, $2, $3, $4)";
  },
  closeAccount: function() {
    return "UPDATE customers SET status = 'Closed' WHERE customer_id = $1";
  },
  generateJWT: function() {
    return ""
  }
}