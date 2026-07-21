# Quick Setup Guide

Follow these steps to get the Luxury Hotel Management System up and running:

## Prerequisites Check

✅ Node.js installed (v14+): `node --version`
✅ MongoDB installed or MongoDB Atlas account
✅ npm installed: `npm --version`

## Step-by-Step Setup

### 1. Install MongoDB (if not already installed)

#### Windows:
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

#### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Check .env file (already created with default values)
# Edit MONGODB_URI if using MongoDB Atlas

# Seed the database with sample data
node seedData.js

# Start backend server
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
Users seeded!
Rooms seeded!
Database seeded successfully!
```

### 3. Setup Frontend

Open a NEW terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

The browser will automatically open `http://localhost:3000`

## 🎉 You're Ready!

### Test the Application:

1. **Home Page** - `http://localhost:3000`
   - Browse the luxury hotel homepage
   - Scroll through all sections

2. **User Login** - Click "Login" button
   - Email: `john@example.com`
   - Password: `123456`

3. **Admin Login** - Use admin credentials
   - Email: `admin@luxuryhotel.com`
   - Password: `admin123`

4. **Book a Room**:
   - Login as user
   - Go to Dashboard
   - Select a room
   - Click "Book Now"
   - Complete the 3-step booking process

5. **View Bookings**:
   - As User: Click "My Bookings"
   - As Admin: Go to Admin Dashboard

## Troubleshooting

### Backend Issues:

**Port 5000 already in use:**
```bash
# Change PORT in backend/.env to 5001
PORT=5001
```

**MongoDB connection error:**
```bash
# Make sure MongoDB is running
# Windows: Check Services
# Mac/Linux: 
sudo systemctl status mongodb  # Linux
brew services list             # Mac
```

**Module not found:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues:

**Port 3000 already in use:**
- The browser will ask if you want to use a different port
- Choose "Yes"

**Cannot connect to backend:**
- Make sure backend is running on port 5000
- Check backend console for errors

**Module not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## MongoDB Atlas Setup (Optional)

If you prefer cloud database:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for testing)
5. Get connection string
6. Update backend/.env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxury-hotel?retryWrites=true&w=majority
   ```

## Default Room Types & Prices

After seeding, you'll have:
- **Standard** - ₹3,000-3,500/night
- **Deluxe** - ₹5,000-5,500/night
- **Executive** - ₹8,000/night
- **Suite** - ₹10,000-12,000/night
- **Presidential** - ₹25,000/night

## Common Commands

```bash
# Backend
cd backend
npm start              # Start server
npm run dev            # Start with nodemon (auto-reload)
node seedData.js       # Reseed database

# Frontend
cd frontend
npm start              # Start development server
npm run build          # Build for production
```

## Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Test**: http://localhost:5000/api/rooms

## Next Steps

1. Explore all features
2. Test user booking flow
3. Test admin dashboard
4. Customize colors/branding in `frontend/src/index.css`
5. Add more rooms via seedData.js
6. Customize content on home page

## Need Help?

- Check console for errors (F12 in browser)
- Check backend terminal for API errors
- Verify MongoDB is running
- Ensure all dependencies are installed

---

**Happy Coding! 🚀**
