import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/check-availability', protect, checkAvailability);
router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/my-bookings', protect, getUserBookings);
router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
