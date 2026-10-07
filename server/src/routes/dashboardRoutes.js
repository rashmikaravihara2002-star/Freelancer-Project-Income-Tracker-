import express from 'express';
import {
  getDashboardStats,
  getMonthlyIncome,
  getProjectStatusStats,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All dashboard routes are protected

router.get('/stats', getDashboardStats);
router.get('/monthly-income', getMonthlyIncome);
router.get('/project-status', getProjectStatusStats);

export default router;
