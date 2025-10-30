import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getMonthlyStats,
} from '../controllers/transactionController';
import {
  validate,
  validateQuery,
  transactionCreateSchema,
  transactionUpdateSchema,
  transactionQuerySchema,
} from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Stats endpoints (must come before /:id)
router.get('/stats', asyncHandler(getTransactionStats));
router.get('/monthly', asyncHandler(getMonthlyStats));

// CRUD endpoints
router.get('/', validateQuery(transactionQuerySchema), asyncHandler(getAllTransactions));
router.get('/:id', asyncHandler(getTransactionById));
router.post('/', validate(transactionCreateSchema), asyncHandler(createTransaction));
router.put('/:id', validate(transactionUpdateSchema), asyncHandler(updateTransaction));
router.delete('/:id', asyncHandler(deleteTransaction));

export default router;
