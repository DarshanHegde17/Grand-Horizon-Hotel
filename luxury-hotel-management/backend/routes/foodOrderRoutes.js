import express from 'express';
import {
  createFoodOrder,
  getUserFoodOrders,
  getAllFoodOrders,
  getFoodOrderById,
  cancelFoodOrder,
  updateFoodOrderStatus
} from '../controllers/foodOrderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createFoodOrder)
  .get(protect, admin, getAllFoodOrders);

router.get('/my-orders', protect, getUserFoodOrders);
router.route('/:id')
  .get(protect, getFoodOrderById);

router.put('/:id/cancel', protect, cancelFoodOrder);
router.put('/:id/status', protect, admin, updateFoodOrderStatus);

export default router;
