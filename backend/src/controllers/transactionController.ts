import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { NotFoundError, DatabaseError } from '../middleware/errorHandler';

// Default user ID for single-user app (no auth)
const DEFAULT_USER_ID = 'default-user';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Parse query parameters (they come as strings from URL)
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const category = req.query.category as string | undefined;
    const type = req.query.type as 'income' | 'expense' | undefined;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const sortBy = (req.query.sortBy as string) || 'date';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      userId: DEFAULT_USER_ID,
    };

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    throw new DatabaseError('Failed to fetch transactions');
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.userId !== DEFAULT_USER_ID) {
      throw new NotFoundError('Transaction not found');
    }

    res.status(200).json({
      status: 'success',
      data: { transaction },
    });
  } catch (error) {
    throw error;
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        userId: DEFAULT_USER_ID,
        type,
        amount,
        category,
        description,
        date: new Date(date),
      },
    });

    res.status(201).json({
      status: 'success',
      data: { transaction },
    });
  } catch (error) {
    throw new DatabaseError('Failed to create transaction');
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (existingTransaction.userId !== DEFAULT_USER_ID) {
      throw new NotFoundError('Transaction not found');
    }

    // Convert date string to Date if present
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      data: { transaction },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Failed to update transaction');
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (existingTransaction.userId !== DEFAULT_USER_ID) {
      throw new NotFoundError('Transaction not found');
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Failed to delete transaction');
  }
};

export const getTransactionStats = async (_req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: DEFAULT_USER_ID },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Category breakdown
    const categoryMap = new Map<string, { amount: number; type: string }>();

    transactions.forEach((t) => {
      const key = `${t.category}-${t.type}`;
      const existing = categoryMap.get(key) || { amount: 0, type: t.type };
      existing.amount += t.amount;
      categoryMap.set(key, existing);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([key, value]) => {
      const [category] = key.split('-');
      return {
        category,
        amount: value.amount,
        type: value.type,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalIncome,
        totalExpense,
        balance,
        categoryBreakdown,
      },
    });
  } catch (error) {
    throw new DatabaseError('Failed to fetch transaction statistics');
  }
};

export const getMonthlyStats = async (_req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: 'asc' },
    });

    // Group by month
    const monthlyMap = new Map<
      string,
      { month: string; income: number; expense: number; balance: number }
    >();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      const existing = monthlyMap.get(monthKey) || {
        month: monthLabel,
        income: 0,
        expense: 0,
        balance: 0,
      };

      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expense += t.amount;
      }

      existing.balance = existing.income - existing.expense;
      monthlyMap.set(monthKey, existing);
    });

    // Get last 6 months
    const monthlyStats = Array.from(monthlyMap.values()).slice(-6);

    res.status(200).json({
      status: 'success',
      data: { monthlyStats },
    });
  } catch (error) {
    throw new DatabaseError('Failed to fetch monthly statistics');
  }
};
