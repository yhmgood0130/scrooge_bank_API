DROP TABLE IF EXISTS bank_account cascade;
DROP TABLE IF EXISTS customers cascade;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS transactions cascade;
DROP TABLE IF EXISTS loan cascade;

CREATE TABLE customers
(
    customer_id INT GENERATED ALWAYS AS IDENTITY,
    first_name text  NOT NULL,
    last_name text NOT NULL,
    status text DEFAULT 'Active' NOT NULL,
    PRIMARY KEY(customer_id)
);

CREATE TABLE bank_account 
(
    account_id INT GENERATED ALWAYS AS IDENTITY,
    -- acc_name text NOT NULL,
    -- acc_type text NOT NULL,
    customer_id int UNIQUE NOT NULL,
    -- total_balance int DEFAULT 0 NOT NULL,
    PRIMARY KEY(account_id),
    CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
            REFERENCES customers(customer_id)
);

CREATE TABLE logs 
(
    log_id integer NOT NULL,
    trans_id integer NOT NULL
);

CREATE TABLE transactions
(
    trans_id INT GENERATED ALWAYS AS IDENTITY,
    account_id integer NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    transaction_amount  VARCHAR(20) NOT NULL,
    transaction_timestamp DATE NOT NULL,
    CONSTRAINT transactions_trans_id_pk PRIMARY KEY(trans_id),
    CONSTRAINT fk_account
        FOREIGN KEY(account_id)
            REFERENCES bank_account(account_id)
);

CREATE TABLE loan
   (   
    customer_id int,
    -- bid VARCHAR(6),
    loan_amount integer NOT NULL,
    -- CONSTRAINT loan_customer_custid_bid_pk PRIMARY KEY(customer_id),
    CONSTRAINT loan_customer_id_fk FOREIGN KEY(customer_id) REFERENCES  customers(customer_id)
    -- CONSTRAINT loan_bid_fk FOREIGN KEY(bid) REFERENCES  branch(bid)
   );

CREATE OR REPLACE FUNCTION function_copy() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        bank_account(customer_id)
        VALUES(new.customer_id);

           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER trig_copy
     AFTER INSERT ON customers
     FOR EACH ROW
     EXECUTE PROCEDURE function_copy();

INSERT INTO customers(first_name, last_name)
VALUES('Doe','Jane'),
      ('Doe','John');

INSERT INTO transactions(account_id,transaction_type,transaction_amount)
VALUES (1, 'Deposit', 1000),
       (1, 'Withdraw', -500),
       (1, 'Withdraw', -200),
       (1, 'Withdraw', -50),
       (1, 'Deposit', 4000)








/**

 SELECT * FROM bank_account;
 
 SELECT * FROM customers WHERE customer_id = 1;
 
 SELECT * FROM transactions;
 
select *,

(select SUM(transaction_amount) AS total from transactions where transaction_timestamp <= a.transaction_timestamp)

from transactions AS a;



SELECT SUM(transactions.transaction_amount)
FROM ((customers
INNER JOIN bank_account ON customers.customer_id = bank_account.customer_id)
INNER JOIN transactions ON bank_account.account_id = transactions.account_id)
WHERE customers.customer_id = 1;
**/