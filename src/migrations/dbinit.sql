DROP TABLE IF EXISTS bank_account cascade;
DROP TABLE IF EXISTS customers cascade;
DROP TABLE IF EXISTS transactions cascade;
DROP TABLE IF EXISTS loan cascade;
DROP TABLE IF EXISTS loan_payment cascade;
DROP TABLE IF EXISTS credit_card cascade;
DROP TABLE IF EXISTS credit_card_type cascade;

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
    customer_id int UNIQUE,
    PRIMARY KEY(account_id),
    CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
            REFERENCES customers(customer_id)
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

CREATE TABLE credit_card_type
(
	credit_card_type_id int GENERATED ALWAYS AS IDENTITY,
	card_type VARCHAR(20) NOT NULL,
	minimum_score int NOT NULL,
	CONSTRAINT credit_card_type_pk PRIMARY KEY(credit_card_type_id)
);

CREATE TABLE credit_card
(
	credit_card_id int GENERATED ALWAYS AS IDENTITY,
	customer_id int NOT NULL,
	credit_card_type_id INT NOT NULL,
    CONSTRAINT credit_card_pk PRIMARY KEY(credit_card_id),
    CONSTRAINT credit_card_customer_id_fk FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
	CONSTRAINT credit_card_type_id_fk FOREIGN KEY(credit_card_type_id) REFERENCES credit_card_type(credit_card_type_id)
);


INSERT INTO bank_account(customer_id)
VALUES(null);

INSERT INTO transactions(account_id,transaction_type,transaction_amount, transaction_timestamp)
VALUES (1, 'Loan', 250000, '2022-02-02 12:05:00');

INSERT INTO credit_card_type (card_type, minimum_score)
VALUES ('Express', 680),
	   ('Platinum', 720),
	   ('Titanium', 750);

-- CREATE OR REPLACE FUNCTION function_copy() RETURNS TRIGGER AS
-- $BODY$
-- BEGIN
--     INSERT INTO
--         bank_account(customer_id)
--         VALUES(new.customer_id);

--            RETURN new;
-- END;
-- $BODY$
-- language plpgsql;

-- CREATE TRIGGER trig_copy
--      AFTER INSERT ON customers
--      FOR EACH ROW
--      EXECUTE PROCEDURE function_copy();