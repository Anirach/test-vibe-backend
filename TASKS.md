# Task List: Full-Stack Expense Tracker Implementation

## Project Goal
Transform the current client-side expense tracker into a full-stack application with a backend API using Node.js, Express, Prisma ORM, and SQLite3 database.

---

## Phase 1: Backend Setup & Database Configuration

### Task 1.1: Initialize Backend Project Structure
- [ ] Create `/backend` directory in project root
- [ ] Initialize new Node.js project in backend folder
  ```bash
  cd backend
  npm init -y
  ```
- [ ] Install core dependencies:
  ```bash
  npm install express cors dotenv
  npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
  ```
- [ ] Create `tsconfig.json` for backend TypeScript configuration
- [ ] Create backend folder structure:
  ```
  backend/
  ├── src/
  │   ├── controllers/
  │   ├── routes/
  │   ├── middleware/
  │   ├── types/
  │   ├── utils/
  │   └── server.ts
  ├── prisma/
  │   └── schema.prisma
  ├── .env
  └── package.json
  ```

### Task 1.2: Setup Prisma ORM with SQLite
- [ ] Install Prisma dependencies:
  ```bash
  npm install @prisma/client
  npm install -D prisma
  ```
- [ ] Initialize Prisma:
  ```bash
  npx prisma init --datasource-provider sqlite
  ```
- [ ] Configure `.env` file with database URL:
  ```
  DATABASE_URL="file:./dev.db"
  PORT=3001
  ```

### Task 1.3: Define Database Schema
- [ ] Create Prisma schema in `prisma/schema.prisma`:
  - **User model**: id, email, password, name, createdAt, updatedAt
  - **Transaction model**: id, userId, type, amount, category, description, date, createdAt, updatedAt
  - Define relationships: User has many Transactions
- [ ] Add indexes for performance (userId, date, category)
- [ ] Run Prisma migration:
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Generate Prisma Client:
  ```bash
  npx prisma generate
  ```

### Task 1.4: Create Prisma Client Instance
- [ ] Create `src/utils/prisma.ts` with Prisma client singleton
- [ ] Export configured Prisma client for use across the application

---

## Phase 2: Backend API Development

### Task 2.1: Setup Express Server
- [ ] Create `src/server.ts` with Express app configuration
- [ ] Setup CORS middleware for frontend communication
- [ ] Add JSON body parser middleware
- [ ] Add error handling middleware
- [ ] Configure server port from environment variables
- [ ] Add health check endpoint: `GET /api/health`

### Task 2.2: Create Transaction Routes
- [ ] Create `src/routes/transactions.ts`
- [ ] Define RESTful endpoints:
  - `GET /api/transactions` - Get all transactions (with optional filters)
  - `GET /api/transactions/:id` - Get single transaction
  - `POST /api/transactions` - Create new transaction
  - `PUT /api/transactions/:id` - Update transaction
  - `DELETE /api/transactions/:id` - Delete transaction
  - `GET /api/transactions/stats` - Get transaction statistics
  - `GET /api/transactions/monthly` - Get monthly aggregated data

### Task 2.3: Create Transaction Controllers
- [ ] Create `src/controllers/transactionController.ts`
- [ ] Implement `getAllTransactions` controller:
  - Add pagination (page, limit)
  - Add filtering (category, type, month, year)
  - Add sorting (date, amount)
  - Return total count for pagination
- [ ] Implement `getTransactionById` controller
- [ ] Implement `createTransaction` controller:
  - Validate required fields
  - Convert date string to Date object
  - Save to database via Prisma
- [ ] Implement `updateTransaction` controller:
  - Check if transaction exists
  - Update only provided fields
  - Return updated transaction
- [ ] Implement `deleteTransaction` controller:
  - Check if transaction exists
  - Soft delete or hard delete
- [ ] Implement `getTransactionStats` controller:
  - Calculate total income
  - Calculate total expenses
  - Calculate balance
  - Group by category
- [ ] Implement `getMonthlyStats` controller:
  - Aggregate transactions by month
  - Calculate income, expense, balance per month
  - Return last 6-12 months

### Task 2.4: Add Request Validation Middleware
- [ ] Install validation library:
  ```bash
  npm install zod
  ```
- [ ] Create `src/middleware/validation.ts`
- [ ] Create Zod schemas for:
  - Transaction creation
  - Transaction update
  - Query parameters validation
- [ ] Add validation middleware to routes

### Task 2.5: Add Error Handling
- [ ] Create `src/middleware/errorHandler.ts`
- [ ] Create custom error classes:
  - NotFoundError
  - ValidationError
  - DatabaseError
- [ ] Add global error handler middleware
- [ ] Add async error wrapper utility

### Task 2.6: Create TypeScript Types
- [ ] Create `src/types/transaction.ts` with:
  - TransactionType enum
  - TransactionCategory enum
  - Transaction interface
  - CreateTransactionDTO
  - UpdateTransactionDTO
  - TransactionQueryParams
  - TransactionStats interface
  - MonthlyStats interface

---

## Phase 3: Backend Utilities & Scripts

### Task 3.1: Create Database Seeder
- [ ] Create `src/utils/seed.ts`
- [ ] Add sample user data
- [ ] Add sample transaction data (various categories, dates)
- [ ] Add seed script to package.json:
  ```json
  "seed": "ts-node src/utils/seed.ts"
  ```

### Task 3.2: Add Logging
- [ ] Install logging library:
  ```bash
  npm install winston
  ```
- [ ] Create `src/utils/logger.ts`
- [ ] Add request logging middleware
- [ ] Log errors and important operations

### Task 3.3: Add Development Scripts
- [ ] Update `package.json` scripts:
  ```json
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "seed": "ts-node src/utils/seed.ts"
  }
  ```

---

## Phase 4: Frontend Integration

### Task 4.1: Setup API Client
- [ ] Install axios in frontend:
  ```bash
  npm install axios
  ```
- [ ] Create `src/lib/api-client.ts`:
  - Configure axios instance with base URL
  - Add request/response interceptors
  - Add error handling

### Task 4.2: Create API Service Layer
- [ ] Create `src/services/transactionService.ts`
- [ ] Implement API methods:
  - `getTransactions(filters)` - GET /api/transactions
  - `getTransactionById(id)` - GET /api/transactions/:id
  - `createTransaction(data)` - POST /api/transactions
  - `updateTransaction(id, data)` - PUT /api/transactions/:id
  - `deleteTransaction(id)` - DELETE /api/transactions/:id
  - `getTransactionStats()` - GET /api/transactions/stats
  - `getMonthlyStats()` - GET /api/transactions/monthly

### Task 4.3: Update TransactionContext to Use API
- [ ] Modify `src/contexts/TransactionContext.tsx`
- [ ] Replace LocalStorage operations with API calls
- [ ] Add loading states for async operations
- [ ] Add error handling with user feedback
- [ ] Keep optimistic updates for better UX
- [ ] Add retry logic for failed requests

### Task 4.4: Update Components for Async Operations
- [ ] Update `TransactionList` component:
  - Add loading spinner during data fetch
  - Add error state display
  - Add empty state when no data
- [ ] Update `StatsCard` component:
  - Show loading skeleton
  - Handle error states
- [ ] Update `MonthlyChart` component:
  - Add loading state
  - Handle empty data gracefully
- [ ] Update `TransactionDialog` component:
  - Show loading state during save
  - Handle API errors with toast notifications

### Task 4.5: Add Pagination to Frontend
- [ ] Install pagination UI component or create custom
- [ ] Update `TransactionList` to support pagination
- [ ] Add page size selector
- [ ] Update API calls to include pagination parameters
- [ ] Display total count and current page

### Task 4.6: Implement Advanced Filtering
- [ ] Update `FilterBar` component:
  - Add date range picker
  - Add amount range filter
  - Add search/description filter
- [ ] Update API calls with filter parameters
- [ ] Add URL query params for shareable filters

---

## Phase 5: Enhanced Features

### Task 5.1: Add Export with Backend
- [ ] Create backend endpoint: `GET /api/transactions/export`
- [ ] Generate CSV on server side
- [ ] Stream file download to frontend
- [ ] Update frontend export button to use API

### Task 5.2: Add Data Backup/Import
- [ ] Create endpoint: `POST /api/transactions/import`
- [ ] Accept CSV/JSON file upload
- [ ] Validate and parse uploaded data
- [ ] Bulk insert transactions
- [ ] Add import UI in frontend

### Task 5.3: Add Transaction Categories Management
- [ ] Create categories table in database
- [ ] Add CRUD endpoints for categories
- [ ] Allow users to create custom categories
- [ ] Update frontend to fetch dynamic categories

### Task 5.4: Add Budgets Feature
- [ ] Create Budget model in Prisma schema
- [ ] Add budget CRUD endpoints
- [ ] Create budget management UI
- [ ] Add budget vs actual comparison charts
- [ ] Add budget alerts/notifications

### Task 5.5: Add Recurring Transactions
- [ ] Add recurring transactions table
- [ ] Create cron job to generate transactions
- [ ] Add UI for managing recurring transactions
- [ ] Add frequency options (daily, weekly, monthly, yearly)

---

## Phase 6: Performance & Optimization

### Task 6.1: Add Database Indexes
- [ ] Review query patterns
- [ ] Add composite indexes for common queries
- [ ] Add indexes on foreign keys
- [ ] Run performance analysis

### Task 6.2: Implement Caching
- [ ] Install Redis or use in-memory cache
- [ ] Cache frequently accessed data (stats, monthly data)
- [ ] Add cache invalidation on updates
- [ ] Configure cache TTL

### Task 6.3: Add Request Rate Limiting
- [ ] Install rate limiting middleware:
  ```bash
  npm install express-rate-limit
  ```
- [ ] Configure rate limits per endpoint
- [ ] Add rate limit headers

### Task 6.4: Optimize Frontend Bundle
- [ ] Implement code splitting
- [ ] Lazy load routes and components
- [ ] Optimize images and assets
- [ ] Add service worker for offline support

---

## Phase 7: Documentation & Polish

### Task 7.1: API Documentation
- [ ] Install Swagger/OpenAPI:
  ```bash
  npm install swagger-ui-express swagger-jsdoc
  ```
- [ ] Document all API endpoints
- [ ] Add request/response examples
- [ ] Add error response documentation
- [ ] Host Swagger UI at `/api/docs`

### Task 7.2: Update README
- [ ] Add backend setup instructions
- [ ] Add database migration steps
- [ ] Add API endpoint documentation
- [ ] Add environment variables documentation

### Task 7.3: Code Cleanup
- [ ] Remove unused dependencies
- [ ] Remove console.logs
- [ ] Add JSDoc comments
- [ ] Format code with Prettier
- [ ] Run ESLint and fix issues

### Task 7.4: Final Testing
- [ ] Test all CRUD operations
- [ ] Test pagination and filtering
- [ ] Test error scenarios
- [ ] Test on different browsers
- [ ] Test responsive design on mobile

---

## Implementation Order Summary

1. **Start with Backend Foundation** (Phase 1-2)
2. **Setup Backend Utilities** (Phase 3)
3. **Integrate Frontend with Backend** (Phase 4)
4. **Implement Enhanced Features** (Phase 5) - Pick based on priority
5. **Optimize Performance** (Phase 6)
6. **Document Everything** (Phase 7)

---

## Quick Start Commands

### Backend Setup
```bash
# Create backend directory
mkdir backend && cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv @prisma/client
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon prisma

# Initialize Prisma
npx prisma init --datasource-provider sqlite

# After creating schema, run migration
npx prisma migrate dev --name init

# Start development server
npm run dev
```

### Frontend Updates
```bash
# Install axios for API calls
npm install axios

# Continue with existing Vite dev server
npm run dev
```

---

## Notes
- ✅ No tests required as per requirements
-  Start with basic CRUD, then add advanced features
- 🎯 Focus on completing Phases 1-4 first for a working full-stack app
- 🚀 Phases 5-7 are enhancements and production readiness
- 🔒 This simplified version removes authentication - suitable for personal use or prototyping
