# 📦 Order Management System (OMS) API  

A modular, scalable backend API for a fictional **B2B Order Management Platform** where buyers place and manage orders from suppliers. Built with **Node.js, Express, Sequelize (PostgreSQL/MySQL), and Docker**.

---

## 🚀 Features  

- **User Management** (Buyer, Supplier, Admin roles)  
- **Product Management** (list, update, stock tracking with UOM conversions)  
- **Order Management** (multi-item orders, status transitions, inventory checks)  
- **Order Status History** with full audit trail  
- **Admin Analytics** (orders by status, revenue per supplier, etc.)  
- **Authentication & Role-based Authorization**  
- **Dockerized Deployment**  
- **Swagger API Docs** (`/api-docs`)  

---

## 🏗️ Architecture  

The project follows a **modular MVC-style architecture** for scalability and maintainability:

ASSIGNMENT-NODEJS/
│
├── controllers/        
│   ├── admin.js
│   ├── order.js
│   ├── products.js
│   └── users.js
│
├── models/             
│   ├── inventory.js
│   ├── order.js
│   ├── orderItem.js
│   ├── orderStatusHistory.js
│   ├── product.js
│   ├── productUom.js
│   └── user.js
│
├── routes/            
│   ├── admin.js
│   ├── devAuth.js
│   ├── order.js
│   ├── product.js
│   └── user.js
│
├── util/              
│   └── db.js
│
├── index.js            
├── docker-compose.yml 
├── Dockerfile          
├── package.json        




- **Models**: Represent relational DB tables with Sequelize ORM.  
- **Controllers**: Contain business logic (CRUD, validations, stock handling, order lifecycle).  
- **Routes**: Define REST endpoints, map to controllers, follow REST best practices.  
- **Util**: Shared utilities like DB connection.  
- **Swagger**: API documentation served at `/api-docs`.  

---

##  Setup Instructions  

### 1. Clone the Repo  

```bash
git clone https://github.com/<your-username>/assignment-nodejs.git
cd assignment-nodejs
```

### 2. Install Dependencies

```bash
npm install
```


### 3. Configure Environment
Create a .env file (or update util/db.js) with DB credentials:

```bash
DB_HOST=db
DB_USER=user_123
DB_PASSWORD=pwd_123
DB_NAME=db_123
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### 4. Run with Docker (recommended)

```bash
docker-compose up --build
```
This will:
- Start a PostgreSQL container
- Start the Node.js API container

API will be available at: http://localhost:3000

### 5. Run without Docker 

Make sure PostgreSQL/MySQL is running locally and update .env.
```bash
npm start
```
This will:
- Start a PostgreSQL container
- Start the Node.js API container

API will be available at: http://localhost:3000


## Database & Migrations

### ORM: Sequelize

### Normalized relational design:

- Users (buyer, supplier, admin roles)

- Products (linked to suppliers, UOM conversion supported)

- Inventory (tracks stock per supplier/product)

- Orders (multiple order items per order)

- OrderItems (line items with UOM and quantity)

- OrderStatusHistory (status transitions with timestamps)

Migration or schema file will be included under migrations/ or via Sequelize sync.

## API Documentation

Swagger UI available at:
http://localhost:3000/api-docs
