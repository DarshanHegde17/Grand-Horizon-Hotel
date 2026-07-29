import FoodOrder from '../models/FoodOrder.js';

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `FO${timestamp}${randomStr}`.toUpperCase();
};

// @desc    Create new food order
// @route   POST /api/food-orders
// @access  Private
export const createFoodOrder = async (req, res) => {
  try {
    const { roomNumber, items, totalAmount, specialInstructions } = req.body;

    const foodOrder = await FoodOrder.create({
      orderId: generateOrderId(),
      user: req.user._id,
      roomNumber,
      items,
      totalAmount,
      specialInstructions,
      status: 'Pending'
    });

    const populatedOrder = await FoodOrder.findById(foodOrder._id)
      .populate('user', 'name email phone');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's food orders
// @route   GET /api/food-orders/my-orders
// @access  Private
export const getUserFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all food orders (Admin)
// @route   GET /api/food-orders
// @access  Private/Admin
export const getAllFoodOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const orders = await FoodOrder.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // Search filter
    let filteredOrders = orders;
    if (search) {
      filteredOrders = orders.filter(order => 
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food order
// @route   GET /api/food-orders/:id
// @access  Private
export const getFoodOrderById = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (order) {
      // Check if user owns the order or is admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel food order
// @route   PUT /api/food-orders/:id/cancel
// @access  Private
export const cancelFoodOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id);
    
    if (order) {
      // Check if user owns the order
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this order' });
      }

      // Check if order can be cancelled
      if (order.status === 'Cancelled') {
        return res.status(400).json({ message: 'Order already cancelled' });
      }

      if (order.status === 'Delivered') {
        return res.status(400).json({ message: 'Cannot cancel delivered order' });
      }

      order.status = 'Cancelled';
      const updatedOrder = await order.save();
      
      const populatedOrder = await FoodOrder.findById(updatedOrder._id)
        .populate('user', 'name email phone');

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update food order status (Admin only)
// @route   PUT /api/food-orders/:id/status
// @access  Private/Admin
export const updateFoodOrderStatus = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id);
    
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      
      const populatedOrder = await FoodOrder.findById(updatedOrder._id)
        .populate('user', 'name email phone');

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
