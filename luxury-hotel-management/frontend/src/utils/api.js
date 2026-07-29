import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Room APIs
export const roomAPI = {
  getAllRooms: (params) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`)
};

// Booking APIs
export const bookingAPI = {
  checkAvailability: (data) => api.post('/bookings/check-availability', data),
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status })
};

// Contact API
export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getAllMessages: () => api.get('/contact')
};

// Food Order APIs
export const foodOrderAPI = {
  createOrder: (data) => api.post('/food-orders', data),
  getUserOrders: () => api.get('/food-orders/my-orders'),
  getAllOrders: (params) => api.get('/food-orders', { params }),
  getOrderById: (id) => api.get(`/food-orders/${id}`),
  cancelOrder: (id) => api.put(`/food-orders/${id}/cancel`),
  updateOrderStatus: (id, status) => api.put(`/food-orders/${id}/status`, { status })
};

export default api;
