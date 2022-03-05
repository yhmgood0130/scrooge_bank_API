# Project Title

Scrooge Bank API

## Description

![Scrooge Bank](http://pm1.narvii.com/6135/8ddf8092172606e29e9c40f9474496d390a610ad_00.jpg)

### Dependencies

* JavaScript (Tiny bit of TypeScript)
* Express
* Postgres
* Mocha & Should
* JsonWebToken
* bCrypt
* Docker (Incompleted as I had some issues with setting up postgres and didn't have enough time)
* .env (I purposefully didn't include .env file in .gitignore so that way you wouldn't need to manually create the file and set up the environment when you clone the project)
### Installing

* npm install
* npm install -g mocha

### Executing program

* npm start
* Copy Script from migrations/dbinit.sql and paste & run in pgAdmin 
(I was planning on setting up knex.js but didn't have enoguh time)
  - For myself, I ran the script under the database named 'postgres'
* For testing, 
  - Run the entire script dbinit.sql in pgAdmin each other before running the test.
  - Please run 'mocha' in src folder. (Make sure that the server is running in the background)
* POSTMAN collection (v2.1) is located in SCROOGE_BANK_API/collections/SFOX.postman_collection.json (should be located all the way to the top of the list in Explorer)
  - You should be able to execute 'Run Collection' in Postman as I placed API endpoints in order

## User Story

General
* - [x] As the bank operator, I should be able to see how much money total we currently have on hand. 
- [] As the bank operator, user withdrawals are allowed to put the bank into debt, but loans are not.

Accounts
* - [x] As a user, I should be able to open an Account
* - [x] As a user, I should be able to close an Account
* - [x] As a user, I should not be allowed to have more than 1 open account
Deposits
* - [x] As a user, I should be able to make a deposit to my account
* - [x] As a user, If I do not have an account when I deposit, I should see an error
* - [x] As a user, I should not be able to make deposits to other people’s accounts
Withdrawals
* - [x] As a user, I should be able to make a withdrawal from my account
* - [x] As a user, is I do not have enough funds, I should see an error
* - [x] As a user, I should not be able to make withdrawals from other people’s accounts
Loans
- [x] As a user, I should be able to apply for a loan
- [x] As a user, my loan should be accepted if the bank has enough money to cover it
- [x] As a user, when I apply for a loan, it should be rejected if the bank doesn’t have enough money to cover it.
- [x] As a user, I can make a payment on my loan

Credit Card
* - [x] As a user, I should be able to apply for a credit card with a specific credit card type
* - [x] As a user, my credit card application gets denied if my credit score is not high enough

```
I wrote Credit Card user story to this project. The reason is
- Attract the customers with more financial product
- Easy access to credit
- Increase the number of customers to bank
- Offer bundle services to new / existing customers
```

## Authors

Contributors names and contact info

Moe Yang 
Email: yhmgood47@gmail.com
[@moe_yang](https://twitter.com/duck_nest13)

## License

This project is licensed under the [MOE YANG] License - see the LICENSE.md file for details
