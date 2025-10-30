# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, this application does not require authentication. All transactions are associated with a default user ID (`default-user`).

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Transactions

#### GET /transactions

Get all transactions with optional filtering and pagination.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number for pagination | 1 |
| limit | number | Number of results per page (max 100) | 10 |
| category | string | Filter by category | - |
| type | string | Filter by type (`income` or `expense`) | - |
| month | number | Filter by month (1-12) | - |
| year | number | Filter by year | - |
| sortBy | string | Sort by field (`date` or `amount`) | date |
| sortOrder | string | Sort order (`asc` or `desc`) | desc |

**Response:**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "userId": "default-user",
        "type": "expense",
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": "2024-10-30T10:00:00.000Z",
        "createdAt": "2024-10-30T10:00:00.000Z",
        "updatedAt": "2024-10-30T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

**Example:**
```bash
curl "http://localhost:3001/api/transactions?page=1&limit=10&type=expense&category=Food"
```

---

#### GET /transactions/:id

Get a single transaction by ID.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID (UUID) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "id": "uuid",
      "userId": "default-user",
      "type": "income",
      "amount": 5000.00,
      "category": "Salary",
      "description": "Monthly salary",
      "date": "2024-10-01T00:00:00.000Z",
      "createdAt": "2024-10-01T00:00:00.000Z",
      "updatedAt": "2024-10-01T00:00:00.000Z"
    }
  }
}
```

**Example:**
```bash
curl "http://localhost:3001/api/transactions/123e4567-e89b-12d3-a456-426614174000"
```

---

#### POST /transactions

Create a new transaction.

**Request Body:**
```json
{
  "type": "expense",
  "amount": 75.50,
  "category": "Food",
  "description": "Dinner at restaurant",
  "date": "2024-10-30T19:00:00.000Z"
}
```

**Validation Rules:**
- `type`: Required. Must be `income` or `expense`
- `amount`: Required. Must be a positive number
- `category`: Required. Must be one of the predefined categories
- `description`: Required. Minimum 1 character
- `date`: Required. Must be a valid date string or Date object

**Categories:**
- **Income:** Salary, Freelance, Investment, Other
- **Expense:** Food, Travel, Bills, Shopping, Entertainment, Healthcare, Other

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "id": "uuid",
      "userId": "default-user",
      "type": "expense",
      "amount": 75.50,
      "category": "Food",
      "description": "Dinner at restaurant",
      "date": "2024-10-30T19:00:00.000Z",
      "createdAt": "2024-10-30T19:00:00.000Z",
      "updatedAt": "2024-10-30T19:00:00.000Z"
    }
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3001/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 75.50,
    "category": "Food",
    "description": "Dinner at restaurant",
    "date": "2024-10-30T19:00:00.000Z"
  }'
```

---

#### PUT /transactions/:id

Update an existing transaction.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID (UUID) |

**Request Body (all fields optional):**
```json
{
  "type": "expense",
  "amount": 80.00,
  "category": "Entertainment",
  "description": "Movie tickets",
  "date": "2024-10-30T20:00:00.000Z"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "id": "uuid",
      "userId": "default-user",
      "type": "expense",
      "amount": 80.00,
      "category": "Entertainment",
      "description": "Movie tickets",
      "date": "2024-10-30T20:00:00.000Z",
      "createdAt": "2024-10-29T10:00:00.000Z",
      "updatedAt": "2024-10-30T20:00:00.000Z"
    }
  }
}
```

**Example:**
```bash
curl -X PUT "http://localhost:3001/api/transactions/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 80.00,
    "description": "Updated description"
  }'
```

---

#### DELETE /transactions/:id

Delete a transaction.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID (UUID) |

**Response:**
```json
{
  "status": "success",
  "message": "Transaction deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3001/api/transactions/123e4567-e89b-12d3-a456-426614174000"
```

---

### Statistics

#### GET /transactions/stats

Get overall transaction statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalIncome": 15000.00,
    "totalExpense": 8500.00,
    "balance": 6500.00,
    "transactionCount": 45
  }
}
```

**Example:**
```bash
curl "http://localhost:3001/api/transactions/stats"
```

---

#### GET /transactions/monthly

Get monthly aggregated statistics for the last 6 months.

**Response:**
```json
{
  "status": "success",
  "data": {
    "monthlyStats": [
      {
        "month": "May 2024",
        "income": 5000.00,
        "expense": 3200.00,
        "balance": 1800.00
      },
      {
        "month": "June 2024",
        "income": 5200.00,
        "expense": 2800.00,
        "balance": 2400.00
      }
    ]
  }
}
```

**Example:**
```bash
curl "http://localhost:3001/api/transactions/monthly"
```

---

### Export

#### GET /transactions/export

Export transactions to CSV or JSON format.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| format | string | Export format (`csv` or `json`) | csv |
| category | string | Filter by category | - |
| type | string | Filter by type | - |
| month | number | Filter by month | - |
| year | number | Filter by year | - |

**Response:**
- Content-Type: `text/csv` or `application/json`
- Content-Disposition: `attachment; filename=transactions.{format}`

**CSV Format:**
```csv
id,type,amount,category,description,date,createdAt,updatedAt
uuid,expense,50.00,Food,"Grocery shopping",2024-10-30T10:00:00.000Z,2024-10-30T10:00:00.000Z,2024-10-30T10:00:00.000Z
```

**JSON Format:**
```json
[
  {
    "id": "uuid",
    "userId": "default-user",
    "type": "expense",
    "amount": 50.00,
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2024-10-30T10:00:00.000Z",
    "createdAt": "2024-10-30T10:00:00.000Z",
    "updatedAt": "2024-10-30T10:00:00.000Z"
  }
]
```

**Example:**
```bash
# Export as CSV
curl "http://localhost:3001/api/transactions/export?format=csv&type=expense" -o transactions.csv

# Export as JSON
curl "http://localhost:3001/api/transactions/export?format=json&category=Food" -o transactions.json
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

## Error Examples

### Validation Error (400)
```json
{
  "status": "error",
  "message": "Amount must be positive, Description is required"
}
```

### Not Found Error (404)
```json
{
  "status": "error",
  "message": "Transaction not found"
}
```

### Server Error (500)
```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

## Database Schema

### Transaction Model

```typescript
{
  id: string;          // UUID
  userId: string;      // User ID (currently "default-user")
  type: string;        // "income" or "expense"
  amount: number;      // Transaction amount (positive number)
  category: string;    // Transaction category
  description: string; // Transaction description
  date: Date;         // Transaction date
  createdAt: Date;    // Record creation timestamp
  updatedAt: Date;    // Record update timestamp
}
```

### Indexes

The following indexes are created for query optimization:
- `userId`
- `date`
- `category`
- `type`
- `userId, date` (composite)
- `userId, type` (composite)
- `userId, category` (composite)

---

## Performance Optimizations

1. **Database Indexes**: Composite indexes for frequently queried fields
2. **Gzip Compression**: Response compression for reduced bandwidth
3. **Pagination**: Limit response size with configurable page size
4. **Date Filtering**: Efficient date range queries

## Future Enhancements

Potential features for future versions:
- User authentication and authorization
- Import transactions from CSV
- Budget tracking and alerts
- Recurring transactions
- Multi-currency support
- Data visualization endpoints
- Webhook notifications
- Rate limiting
- Caching layer
