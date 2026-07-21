# API Reference

Complete API documentation for the Luxury Hotel Management System.

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "+91 9876543210"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "role": "user",
  "token": "jwt_token_here"
}
```

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "role": "user",
  "token": "jwt_token_here"
}
```

### Get User Profile
```
GET /auth/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update User Profile
```
PUT /auth/profile
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "phone": "+91 9876543211",
  "password": "newpassword123"
}
```

---

## Rooms

### Get All Rooms
```
GET /rooms
```

**Query Parameters:**
- `roomType` - Filter by room type (Standard, Deluxe, Suite, etc.)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Example:**
```
GET /rooms?roomType=Deluxe&minPrice=5000&maxPrice=10000
```

**Response:**
```json
[
  {
    "_id": "room_id",
    "roomNumber": "101",
    "roomType": "Deluxe",
    "price": 5000,
    "capacity": 2,
    "amenities": ["Free Wi-Fi", "Air Conditioning", "Mini Bar"],
    "description": "Elegant deluxe room...",
    "images": ["image_url_1", "image_url_2"],
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Room
```
GET /rooms/:id
```

**Response:**
```json
{
  "_id": "room_id",
  "roomNumber": "101",
  "roomType": "Deluxe",
  "price": 5000,
  "capacity": 2,
  "amenities": ["Free Wi-Fi", "Air Conditioning", "Mini Bar"],
  "description": "Elegant deluxe room...",
  "images": ["image_url_1", "image_url_2"],
  "isAvailable": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Room (Admin Only)
```
POST /rooms
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "roomNumber": "104",
  "roomType": "Suite",
  "price": 12000,
  "capacity": 3,
  "amenities": ["Free Wi-Fi", "Jacuzzi", "Balcony"],
  "description": "Luxurious suite...",
  "images": ["image_url_1", "image_url_2"]
}
```

### Update Room (Admin Only)
```
PUT /rooms/:id
Authorization: Bearer {admin_token}
```

### Delete Room (Admin Only)
```
DELETE /rooms/:id
Authorization: Bearer {admin_token}
```

---

## Bookings

### Check Availability
```
POST /bookings/check-availability
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "roomId": "room_id",
  "checkInDate": "2024-12-25",
  "checkOutDate": "2024-12-28"
}
```

**Response:**
```json
{
  "available": true
}
```

### Create Booking
```
POST /bookings
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "roomId": "room_id",
  "checkInDate": "2024-12-25",
  "checkOutDate": "2024-12-28",
  "numberOfGuests": 2,
  "totalAmount": 15000,
  "paymentMethod": "Credit Card"
}
```

**Response:**
```json
{
  "_id": "booking_id",
  "bookingId": "BK1234567890ABC",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210"
  },
  "room": {
    "_id": "room_id",
    "roomNumber": "101",
    "roomType": "Deluxe",
    "price": 5000,
    "images": ["image_url"]
  },
  "checkInDate": "2024-12-25T00:00:00.000Z",
  "checkOutDate": "2024-12-28T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalAmount": 15000,
  "paymentMethod": "Credit Card",
  "status": "Confirmed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get User Bookings
```
GET /bookings/my-bookings
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "booking_id",
    "bookingId": "BK1234567890ABC",
    "room": {
      "roomNumber": "101",
      "roomType": "Deluxe",
      "images": ["image_url"]
    },
    "checkInDate": "2024-12-25T00:00:00.000Z",
    "checkOutDate": "2024-12-28T00:00:00.000Z",
    "numberOfGuests": 2,
    "totalAmount": 15000,
    "paymentMethod": "Credit Card",
    "status": "Confirmed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get All Bookings (Admin Only)
```
GET /bookings
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status` - Filter by status (Confirmed, Cancelled, Completed)
- `search` - Search by booking ID, user name, email

**Example:**
```
GET /bookings?status=Confirmed&search=john
```

### Get Single Booking
```
GET /bookings/:id
Authorization: Bearer {token}
```

**Response:** (Same as Create Booking response)

### Cancel Booking
```
PUT /bookings/:id/cancel
Authorization: Bearer {token}
```

**Response:**
```json
{
  "_id": "booking_id",
  "bookingId": "BK1234567890ABC",
  "status": "Cancelled",
  ...
}
```

**Rules:**
- Can only cancel your own bookings
- Cannot cancel already cancelled bookings
- Cannot cancel completed bookings
- Cannot cancel past or ongoing bookings

### Update Booking Status (Admin Only)
```
PUT /bookings/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "Completed"
}
```

---

## Contact

### Send Contact Message
```
POST /contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "message": "I would like to know about..."
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "contact": {
    "_id": "contact_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "message": "I would like to know about...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Contact Messages (Admin Only)
```
GET /contact
Authorization: Bearer {admin_token}
```

**Response:**
```json
[
  {
    "_id": "contact_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "message": "I would like to know about...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","phone":"+91 1234567890"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

### Get Rooms
```bash
curl http://localhost:5000/api/rooms
```

### Get Profile (Protected)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Set base URL as environment variable: `http://localhost:5000/api`
3. For protected routes:
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your JWT token

---

## Rate Limiting (Future Enhancement)

Currently no rate limiting implemented. For production, consider adding:
- Rate limiting middleware (express-rate-limit)
- API key authentication for external access
- Request throttling

---

## Notes

- All dates should be in ISO 8601 format
- Tokens expire after 30 days
- Admin endpoints require `role: 'admin'`
- Booking IDs are auto-generated in format: `BK{timestamp}{random}`
- All monetary values are in INR (₹)
