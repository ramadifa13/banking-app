# Project Setup

This project is a web application built using **Next.js** as the front-end framework, **MySQL** as the database, and **Prisma** as the ORM to manage the database. It includes a database seed to populate the database with initial data.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

1. **Node.js** (LTS version recommended) - [Download Node.js](https://nodejs.org/)
2. **MySQL** (or access to a MySQL database) - [Install MySQL](https://dev.mysql.com/downloads/)
3. **Yarn** (optional, but recommended) - [Install Yarn](https://yarnpkg.com/getting-started/install)
4. **Prisma** CLI for managing database models - Installed via NPM/Yarn.

---

## Steps to Set Up the Project

### Clone the repository

```bash
git clone https://github.com/ramadifa13/banking-app.git
cd banking-app
npm install

```
### create database
```bash
update .env
mysql -u root -p 
CREATE DATABASE your_database_name;
```
### setup 
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

### run project
```bash
npm run dev //for frontend

```

### Database Design
The database structure consists of the following models:

User
```bash
id: Primary key, auto-incremented.
username: A unique username for each user.
password: Stores the user's hashed password.
role: Role of the user (e.g., customer, admin).
email: Optional email field.
createdAt: Timestamp for when the user was created.
updatedAt: Timestamp for the last update to the user's information.
customer: A one-to-one relationship with the Customer model.
```
Customer
```bash
id: Primary key, auto-incremented.
userId: Foreign key linking to the User model.
name: Name of the customer.
cifNumber: Unique customer identification number.
address: Customer's address.
dob: Date of birth.
email: Email of the customer.
phoneNumber: Optional phone number.
accounts: One-to-many relationship with the Account model.
```
Account
```bash
id: Primary key, auto-incremented.
accountNumber: Unique account number.
accountType: Type of account (e.g., savings, checking).
balance: Balance of the account.
customerId: Foreign key linking to the Customer model.
transactionsFrom: One-to-many relationship with the Transaction model where the account is the source.
transactionsTo: One-to-many relationship with the Transaction model where the account is the destination.
```
Transaction
```bash
id: Primary key, auto-incremented.
fromAccountId: Foreign key linking to the source Account.
toAccountId: Foreign key linking to the destination Account.
amount: Amount of the transaction.
transactionType: Type of the transaction (e.g., "Setoran", "Penarikan", "Transfer").
transactionDate: Date and time the transaction occurred.
transactionStatus: Status of the transaction (e.g., pending, completed).
fromAccount: Relation to the source Account.
toAccount: Relation to the destination Account.
transactionHistories: One-to-many relationship with the TransactionHistory model.

```
TransactionHistory
```bash
id: Primary key, auto-incremented.
transactionId: Foreign key linking to the Transaction model.
changedBalance: The balance change caused by this transaction.
createdAt: Timestamp of when the history entry was created.
transaction: Relation to the Transaction model.
```


