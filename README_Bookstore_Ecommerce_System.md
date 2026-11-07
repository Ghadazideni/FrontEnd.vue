# Bookstore E-Commerce System

A bookstore e-commerce project with a JavaScript/Express backend and a MySQL database. The API supports user accounts, book catalog management, order placement, stock control, and administrator order management.

## Overview

The backend is built with **Node.js** and **Express 5**. It connects to a **MySQL** database using `mysql2` and exposes JSON REST endpoints for users, books, and orders.

The repository's root `package.json` also lists Vue ecosystem dependencies (`vue-router`, `pinia`, and `axios`), indicating a planned or associated Vue frontend. However, the ZIP archive provided for this documentation did not contain Vue application source files (such as `src/`, `App.vue`, or `vite.config.*`). Therefore, this README documents the backend functionality visible in the supplied source and does not claim to describe an inspected frontend.

## Features

### User accounts
- Register users with a name, email, and password.
- Prevent registration with an email address that already exists.
- Log in using email and password.
- Assign the `user` role to newly registered accounts.
- Seed a default administrator account when the backend starts, if it does not already exist.

### Book catalog
- Retrieve the full book catalog.
- Retrieve an individual book by its ID.
- Allow administrators to add books.
- Allow administrators to update book details.
- Allow administrators to delete books.
- Store book information such as title, author, cover, price, category, description, and stock quantity.

### Shopping orders
- Submit orders containing multiple books and quantities.
- Verify that the user exists before saving an order.
- Check book availability and stock quantities.
- Decrease stock when an order is placed.
- Use a MySQL transaction to keep stock updates and order creation consistent.
- Store order items and delivery-address information as JSON.
- Allow administrators to retrieve orders with customer details.

### Administrator access
- Protect selected book-management and order-management routes with an administrator check.
- Separate regular-user registration from administrator-seeded access.

## Technology Stack

### Backend
- JavaScript
- Node.js
- Express 5
- MySQL
- `mysql2`
- CORS
- `body-parser` (listed as a backend dependency; Express JSON middleware is used in the server)

### Frontend dependencies listed in the root package
- Vue ecosystem: Vue Router
- Pinia
- Axios

**Note:** The supplied ZIP did not include the actual Vue frontend source code, so its components, pages, and frontend build setup could not be verified.

## Project Structure

The source files present in the supplied archive include:

```text
Bookstore-Ecommerce-System/
├── backend/
│   ├── db.js           # MySQL connection pool
│   ├── schema.sql      # Database and table definitions
│   ├── server.js       # Express API and route handlers
│   └── package.json    # Backend dependencies
├── package.json        # Root frontend-related dependencies
└── package-lock.json
```

## Prerequisites

- Node.js and npm
- MySQL Server

## Database Setup

1. Start your MySQL server.
2. Run the SQL script in `backend/schema.sql` to create the `bookstore_db` database and its initial tables.
3. Review `backend/db.js` and update the MySQL host, username, password, and database settings for your local environment.

The supplied database configuration uses:

- Host: `localhost`
- User: `root`
- Database: `bookstore_db`
- Password: empty

Do not use an empty database password or commit real credentials in a public or production environment.

## Run the Backend

From the `backend` directory:

```bash
cd backend
npm install
node server.js
```

The API listens on:

```text
http://localhost:3000
```

A default administrator is seeded on startup if the account does not already exist:

```text
Email: admin@test.com
Password: 123
```

**Security warning:** These are development credentials visible in the source code. Change or remove them before deployment. The current authentication implementation stores and compares passwords as plain text, and the administrator middleware trusts a `role` request header. These are not secure production authentication practices.

## API Endpoints

The following routes are implemented in `backend/server.js`.

| Method | Endpoint | Description | Access in current code |
|---|---|---|---|
| `POST` | `/auth/register` | Register a customer account | Public |
| `POST` | `/auth/login` | Log in and retrieve user details | Public |
| `GET` | `/books` | Retrieve all books | Public |
| `GET` | `/books/:id` | Retrieve one book | Public |
| `POST` | `/books` | Add a book | Admin role header |
| `PUT` | `/books/:id` | Update a book | Admin role header |
| `DELETE` | `/books/:id` | Delete a book | Admin role header |
| `POST` | `/orders` | Place an order and update stock | Public route; user email supplied in body |
| `GET` | `/admin/orders` | Retrieve all orders and customer details | Admin role header |

The administrator check currently reads the `role` HTTP request header. This is suitable only as a classroom demonstration and must be replaced with verified authentication and server-side authorization before real use.

## Order Processing Workflow

1. A customer registers or logs in.
2. The frontend can retrieve books from `GET /books`.
3. The customer submits an order to `POST /orders`, including the email, items, total, date, and optional delivery address.
4. The backend verifies the customer and checks that each requested book exists and has enough stock.
5. The backend decreases the stock quantities and inserts the order inside a database transaction.
6. An administrator can retrieve saved orders through `GET /admin/orders`.

## Recommended Improvements

Before deploying this project or presenting it as production-ready, consider:

- Hashing passwords with bcrypt or Argon2.
- Replacing the client-supplied `role` header with authenticated sessions or signed JWTs and server-side role checks.
- Requiring authenticated users to place orders under their own account rather than trusting an email in the request body.
- Calculating order totals on the server from trusted book prices and quantities.
- Validating request fields, quantities, prices, and delivery-address data.
- Moving database credentials and default administrator credentials into environment variables.
- Adding automated tests and API documentation.
- Including the actual Vue frontend source and setup instructions if the project has a frontend.

## Author

**Chahbani Omar**  
GitHub: [@chahbaniomar](https://github.com/chahbaniomar)

---

*Academic project — Bookstore E-Commerce System.*
