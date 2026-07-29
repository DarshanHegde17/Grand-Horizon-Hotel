import mongoose from 'mongoose';

const foodOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    image: {
      type: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveryTime: {
    type: String,
    default: '30-45 minutes'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);

export default FoodOrder;
