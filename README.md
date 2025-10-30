# 💰 Expense Tracker

A modern, feature-rich personal finance tracking application built with React and TypeScript. Track your income and expenses, visualize spending patterns, and maintain financial wellness with an intuitive interface.

## 🎯 Overview

This is a full-stack expense tracking application with a React frontend and Node.js/Express backend. It allows users to monitor their financial health by tracking income and expenses, viewing detailed statistics, and analyzing spending patterns over time with interactive charts. All data is persisted in an SQLite database.

### ✨ Key Features

- **📊 Dashboard Analytics**: Real-time overview of total balance, income, and expenses
- **💸 Transaction Management**: Add, edit, and delete income/expense transactions via REST API
- **📈 Monthly Charts**: Visual representation of 6-month financial trends using Recharts
- **🔍 Smart Filtering**: Filter transactions by category and month
- **📂 Multiple Categories**: Food, Travel, Bills, Shopping, Entertainment, Healthcare, Salary, Freelance, Investment, and Other
- **📤 CSV Export**: Export filtered transactions for external analysis
- **💾 SQLite Database**: All data persisted in local database with Prisma ORM
- **📱 Responsive Design**: Mobile-friendly interface
- **🔔 Toast Notifications**: Real-time feedback for all user actions
- **⚡ Full REST API**: Complete backend API with validation and error handling

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with animations
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM v6
- **Charts**: Recharts 2.15
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **API Style**: RESTful
- **Dev Tools**: Nodemon, ts-node

## 🚀 Running Locally

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **bun** package manager

Install Node.js using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating):
```bash
nvm install 18
nvm use 18
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anirach/test-vibe-backend.git
   cd test-vibe-backend
   ```

2. **Setup Backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Setup environment variables
   # The .env file should already exist with:
   # DATABASE_URL="file:./dev.db"
   # PORT=3001
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npm run seed
   
   # Start the backend server
   npm run dev
   ```
   
   The backend API will be running at `http://localhost:3001`

3. **Setup Frontend** (in a new terminal)
   ```bash
   # Return to root directory
   cd ..
   
   # Install dependencies
   npm install
   
   # Setup environment variables
   # Create .env file (or use existing .env.example)
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   
   # Start the development server
   npm run dev
   ```
   
   The frontend will be running at `http://localhost:8080` (or next available port)

4. **Open your browser**
   
   Navigate to the URL shown in your terminal (typically `http://localhost:8080` or `http://localhost:8081`)

### Available Scripts

#### Frontend Scripts
- `npm run dev` - Start frontend development server with hot reload
- `npm run build` - Build frontend for production
- `npm run build:dev` - Build frontend with development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

#### Backend Scripts (run from `/backend` directory)
- `npm run dev` - Start backend development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 📁 Project Structure

```
├── backend/                 # Backend server
│   ├── prisma/             # Database schema and migrations
│   │   └── schema.prisma   # Prisma schema definition
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   │   └── transactionController.ts
│   │   ├── middleware/     # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/         # API routes
│   │   │   └── transactions.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── transaction.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── prisma.ts   # Prisma client
│   │   │   └── seed.ts     # Database seeder
│   │   └── server.ts       # Express app entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── src/                    # Frontend application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui base components
│   │   ├── FilterBar.tsx  # Transaction filtering
│   │   ├── MonthlyChart.tsx # Financial trend charts
│   │   ├── StatsCard.tsx  # Dashboard statistics
│   │   ├── TransactionDialog.tsx # Add/Edit transaction modal
│   │   └── TransactionList.tsx   # Transaction display
│   ├── contexts/          # React Context providers
│   │   └── TransactionContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── api-client.ts  # Axios configuration
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Route pages
│   │   ├── Index.tsx      # Main expense tracker page
│   │   └── NotFound.tsx   # 404 page
│   ├── services/          # API service layer
│   │   └── transactionService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── transaction.ts
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
│
├── .env                   # Frontend environment variables
└── package.json
```

## 🎨 Features in Detail

### Transaction Categories

**Income Categories:**
- Salary
- Freelance
- Investment
- Other

**Expense Categories:**
- Food
- Travel
- Bills
- Shopping
- Entertainment
- Healthcare
- Other

## 🔌 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check endpoint
- `GET /api/transactions` - Get all transactions (with pagination & filters)
- `GET /api/transactions/:id` - Get single transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/monthly` - Get monthly aggregated data

### Data Persistence

All transactions are stored in an SQLite database located at `backend/prisma/dev.db`. The database is managed by Prisma ORM, which provides type-safe database access and automatic migrations.

## 🌐 Development Workflow

### Edit with Lovable (Visual Editor)

Visit the [Lovable Project](https://lovable.dev/projects/9aed46b4-df44-4a0b-8301-2d309edf871b) to edit visually using AI prompts. Changes are automatically committed to this repository.

### Edit Locally (Traditional IDE)

Make changes in your preferred IDE and push to GitHub. Changes will be reflected in Lovable.

### Edit on GitHub

Use GitHub's web editor or GitHub Codespaces for quick edits without local setup.

## 🚢 Deployment

### Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/9aed46b4-df44-4a0b-8301-2d309edf871b) and click **Share → Publish**.

### Custom Domain
Navigate to **Project > Settings > Domains** and click **Connect Domain**.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Deploy Manually
Build the project and deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.):
```bash
npm run build
# Deploy the 'dist' folder
```

## 📄 License

This project was created with [Lovable](https://lovable.dev).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Project URL**: https://lovable.dev/projects/9aed46b4-df44-4a0b-8301-2d309edf871b
