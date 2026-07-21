import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import generateBookingId from '../utils/generateBookingId.js';

// @desc    Check room availability
// @route   POST /api/bookings/check-availability
// @access  Private
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['Confirmed'] },
      $or: [
        {
          checkInDate: { $lte: checkIn },
          checkOutDate: { $gt: checkIn }
        },
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gte: checkOut }
        },
        {
          checkInDate: { $gte: checkIn },
          checkOutDate: { $lte: checkOut }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, totalAmount, paymentMethod } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['Confirmed'] },
      $or: [
        {
          checkInDate: { $lte: checkIn },
          checkOutDate: { $gt: checkIn }
        },
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gte: checkOut }
        },
        {
          checkInDate: { $gte: checkIn },
          checkOutDate: { $lte: checkOut }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is not available for selected dates' });
    }

    // Create booking
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalAmount,
      paymentMethod,
      status: 'Confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('room')
      .sort({ createdAt: -1 });

    // Search filter
    let filteredBookings = bookings;
    if (search) {
      filteredBookings = bookings.filter(booking => 
        booking.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        booking.user.name.toLowerCase().includes(search.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json(filteredBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room');
    
    if (booking) {
      // Check if user owns the booking or is admin
      if (booking.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      // Check if user owns the booking
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      // Check if booking can be cancelled
      if (booking.status === 'Cancelled') {
        return res.status(400).json({ message: 'Booking already cancelled' });
      }

      if (booking.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot cancel completed booking' });
      }

      const currentDate = new Date();
      if (booking.checkInDate < currentDate) {
        return res.status(400).json({ message: 'Cannot cancel past or ongoing bookings' });
      }

      booking.status = 'Cancelled';
      const updatedBooking = await booking.save();
      
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('user', 'name email phone')
        .populate('room');

      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      booking.status = req.body.status || booking.status;
      const updatedBooking = await booking.save();
      
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('user', 'name email phone')
        .populate('room');

      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
