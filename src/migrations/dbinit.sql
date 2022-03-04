DROP TABLE IF EXISTS bank_account cascade;
DROP TABLE IF EXISTS customers cascade;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS transactions cascade;
DROP TABLE IF EXISTS loan cascade;
DROP TABLE IF EXISTS loan_payment cascade;

CREATE TABLE customers
(
    customer_id INT GENERATED ALWAYS AS IDENTITY,
    first_name text  NOT NULL,
    last_name text NOT NULL,
	email text NOT NULL,
	password text NOT NULL,
    status text DEFAULT 'Active' NOT NULL,
    PRIMARY KEY(customer_id)
);

CREATE TABLE bank_account 
(
    account_id INT GENERATED ALWAYS AS IDENTITY,
    -- acc_name text NOT NULL,
    -- acc_type text NOT NULL,
    customer_id int UNIQUE,
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
    transaction_amount money NOT NULL,
    transaction_timestamp DATE,
    CONSTRAINT transactions_trans_id_pk PRIMARY KEY(trans_id),
    CONSTRAINT fk_account
        FOREIGN KEY(account_id)
            REFERENCES bank_account(account_id)
);

CREATE TABLE loan
(
    loan_id int GENERATED ALWAYS AS IDENTITY,
    customer_id int NOT NULL,
    loan_amount integer NOT NULL,
    CONSTRAINT loan_pk PRIMARY KEY(loan_id),
    CONSTRAINT loan_customer_id_fk FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE loan_payment
(
    load_payment_id int GENERATED ALWAYS AS IDENTITY,
    loan_id int NOT NULL,
    customer_id int NOT NULL,
    payment_amount integer NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT loan_payment_pk PRIMARY KEY(load_payment_id),
    CONSTRAINT loan_payment_customer_id_fk FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
    CONSTRAINT loan_payment_loan_id_fk FOREIGN KEY(loan_id) REFERENCES loan(loan_id)
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

-- INSERT INTO customers(first_name, last_name, email, password)
-- VALUES('Doe','Jane', 'jane@doe.com', '$2b$10$N.2PPCPExlE5gdQVZP899OLazjsqARgRI5v0uvjxzd.ukdCpZ2i/a'),
--       ('Doe','John', 'john@doe.com', '$2b$10$rHyRmP0WsrTqmYl6Lf.66.eq.XlAnXJ2D4wkmbPiu2emZ1RQ4cIs.');
	  
INSERT INTO bank_account(customer_id)
VALUES(null);

INSERT INTO transactions(account_id,transaction_type,transaction_amount, transaction_timestamp)
VALUES (1, 'Loan', 250000, '2022-02-02 12:05:00');


SELECT SUM(CASE WHEN transaction_type != 'Loan' THEN transaction_amount::numeric ELSE 0::numeric END) * 0.25 +
SUM(CASE WHEN transaction_type = 'Loan' THEN transaction_amount::numeric ELSE 0::numeric END) AS loan_total
FROM transactions
UNION ALL
SELECT COALESCE(SUM(loan_amount),0)
FROM loan 

--  SELECT * FROM bank_account;
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