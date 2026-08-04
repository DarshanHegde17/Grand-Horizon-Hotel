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
