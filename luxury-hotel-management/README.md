# Luxury Hotel Management System

A full-stack luxury hotel booking and management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, premium UI, and comprehensive booking management.

## ✨ Features

### Frontend Features
- **Modern, Responsive UI** - Premium design using Bootstrap 5
- **Home Page** - Hero carousel, about section, featured rooms, services, gallery, testimonials, Google Maps, contact form
- **Authentication** - Login/Register with JWT
- **User Dashboard** - Search and filter rooms by type, price, and availability
- **Room Details** - Detailed room information with image carousel
- **3-Step Booking Flow** - Select dates → Review details → Payment
- **Booking Management** - View and cancel bookings
- **Profile Management** - Update user information
- **Admin Dashboard** - View all bookings with search and filter (view-only)
- **Toast Notifications** - Real-time feedback
- **404 Page** - Custom error page

### Backend Features
- **RESTful APIs** - Clean, modular architecture
- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - bcrypt hashing
- **MongoDB Database** - 4 collections (Users, Rooms, Bookings, Contacts)
- **Booking Logic** - Prevent double booking, check availability
- **User Roles** - Admin and regular users
- **Protected Routes** - Role-based access control

### Booking Rules
- Prevents overlapping bookings for the same room
- Booked rooms become unavailable for selected dates
- Users can cancel upcoming bookings
- Cancelled bookings make rooms available again
- Check-in must be in the future
- Check-out must be after check-in

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd luxury-hotel-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (or use the provided `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/luxury-hotel
JWT_SECRET=luxury_hotel_secret_key_2024_mca_project
NODE_ENV=development
```

**Note:** If using MongoDB Atlas, replace the `MONGODB_URI` with your connection string.

### 3. Seed the Database

Populate the database with sample rooms and users:

```bash
node seedData.js
```

This will create:
- **Admin User**: admin@luxuryhotel.com / admin123
- **Test User**: john@example.com / 123456
- **8 Sample Rooms** with different types and amenities

### 4. Start Backend Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@luxuryhotel.com
- **Password**: admin123

### User Account
- **Email**: john@example.com
- **Password**: 123456

## 📁 Project Structure

```
luxury-hotel-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── contactRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── generateBookingId.js
│   ├── .env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── RoomCard.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── UserDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── RoomDetails.js
│   │   │   ├── Booking.js
│   │   │   ├── BookingConfirmation.js
│   │   │   ├── MyBookings.js
│   │   │   ├── Profile.js
│   │   │   └── NotFound.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🛠️ Technologies Used

### Frontend
- React.js 18
- React Router DOM 6
- React Bootstrap 5
- Bootstrap 5
- Axios
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

## 📱 Features Walkthrough

### For Users:
1. **Register/Login** - Create account or login
2. **Browse Rooms** - View all available rooms with filters
3. **Room Details** - See detailed information and amenities
4. **Book Room** - 3-step booking process with date selection and payment
5. **My Bookings** - View booking history and cancel if needed
6. **Profile** - Update personal information

### For Admins:
1. **Login** - Use admin credentials
2. **Dashboard** - View statistics and all bookings
3. **Search/Filter** - Find specific bookings
4. **View Details** - See complete booking information

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based access control
- Input validation
- Secure environment variables

## 🎨 UI/UX Features

- Luxury-themed color scheme (Gold #c9a96e)
- Playfair Display font for headings
- Smooth animations and transitions
- Responsive design for all devices
- Loading spinners
- Toast notifications
- Hover effects on cards
- Sticky navigation bar
- Beautiful hero carousel

## 📊 Database Collections

### Users
- name, email, password (hashed), phone, role, createdAt

### Rooms
- roomNumber, roomType, price, capacity, amenities, description, images, isAvailable, createdAt

### Bookings
- bookingId, user (ref), room (ref), checkInDate, checkOutDate, numberOfGuests, totalAmount, paymentMethod, status, createdAt

### Contacts
- name, email, phone, message, createdAt

## 🚦 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)
- PUT `/api/auth/profile` - Update profile (protected)

### Rooms
- GET `/api/rooms` - Get all rooms (with filters)
- GET `/api/rooms/:id` - Get single room
- POST `/api/rooms` - Create room (admin only)
- PUT `/api/rooms/:id` - Update room (admin only)
- DELETE `/api/rooms/:id` - Delete room (admin only)

### Bookings
- POST `/api/bookings/check-availability` - Check room availability
- POST `/api/bookings` - Create booking (protected)
- GET `/api/bookings/my-bookings` - Get user bookings (protected)
- GET `/api/bookings` - Get all bookings (admin only)
- GET `/api/bookings/:id` - Get single booking (protected)
- PUT `/api/bookings/:id/cancel` - Cancel booking (protected)
- PUT `/api/bookings/:id/status` - Update status (admin only)

### Contact
- POST `/api/contact` - Send contact message
- GET `/api/contact` - Get all messages (admin only)

## 🎯 Future Enhancements

- Email notifications
- Payment gateway integration (Razorpay/Stripe)
- Room availability calendar view
- Reviews and ratings
- Multi-language support
- Advanced reporting for admin
- Photo upload for rooms
- Invoice generation

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as an MCA final year project demonstrating full-stack web development skills.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

**Note**: This is a demo application with fake payment processing. In production, integrate with real payment gateways and add additional security measures.
