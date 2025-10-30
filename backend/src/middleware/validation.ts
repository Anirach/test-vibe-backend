import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from './errorHandler';

export const transactionCreateSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum([
    'Food',
    'Travel',
    'Bills',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other',
  ]),
  description: z.string().min(1, 'Description is required'),
  date: z.string().or(z.date()),
});

export const transactionUpdateSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  category: z
    .enum([
      'Food',
      'Travel',
      'Bills',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Salary',
      'Freelance',
      'Investment',
      'Other',
    ])
    .optional(),
  description: z.string().min(1, 'Description is required').optional(),
  date: z.string().or(z.date()).optional(),
});

export const transactionQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  category: z.string().optional(),
  type: z.enum(['income', 'expense']).optional(),
  month: z.string().optional().transform((val) => (val ? parseInt(val) : undefined)),
  year: z.string().optional().transform((val) => (val ? parseInt(val) : undefined)),
  sortBy: z.enum(['date', 'amount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((err: any) => err.message).join(', ');
        next(new ValidationError(messages));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and validate query, but don't try to overwrite req.query
      // Instead, the controller will use req.query directly
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((err: any) => err.message).join(', ');
        next(new ValidationError(messages));
      } else {
        next(error);
      }
    }
  };
};
