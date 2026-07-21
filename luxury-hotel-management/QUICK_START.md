# 🚀 Quick Start Guide

Get the Luxury Hotel Management System running in 5 minutes!

## Prerequisites

✅ Node.js (v14+) installed
✅ MongoDB installed and running
✅ npm or yarn

## Installation (First Time Only)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Seed Database (One Time Only)
```bash
cd backend
node seedData.js
```

**Output should show:**
```
MongoDB Connected: localhost
Data cleared!
Users seeded!
Rooms seeded!
Database seeded successfully!
```

## Running the Application

### Option 1: Automatic Start (Recommended)

#### Windows:
```bash
# Double-click start.bat
# OR run from command prompt:
start.bat
```

#### Mac/Linux:
```bash
# Make script executable (first time only)
chmod +x start.sh

# Run the script
./start.sh
```

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```
Wait for: "Server running on port 5000"

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
Wait for: Browser opens at http://localhost:3000

## 🎉 You're Ready!

### Access the Application:
- **Website**: http://localhost:3000
- **API**: http://localhost:5000

### Demo Credentials:

**👤 Regular User**
- Email: `john@example.com`
- Password: `123456`

**👨‍💼 Admin User**
- Email: `admin@luxuryhotel.com`
- Password: `admin123`

## Try These First!

### As a User:
1. ✅ Click "Login" → Use john@example.com
2. ✅ Browse rooms on Dashboard
3. ✅ Click "Book Now" on any room
4. ✅ Complete the 3-step booking
5. ✅ View "My Bookings"
6. ✅ Update your Profile

### As an Admin:
1. ✅ Logout → Login with admin credentials
2. ✅ View Admin Dashboard
3. ✅ See booking statistics
4. ✅ Search and filter bookings

## Common Issues & Solutions

### ❌ Backend not starting
**Error**: `Port 5000 is already in use`
**Solution**: 
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### ❌ MongoDB connection error
**Error**: `MongooseServerSelectionError`
**Solution**:
```bash
# Start MongoDB
# Windows: Services → MongoDB → Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### ❌ Frontend not loading
**Error**: `Cannot GET /`
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### ❌ Rooms not showing
**Solution**: Re-seed the database
```bash
cd backend
node seedData.js
```

## Quick Commands Reference

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Reseed database
cd backend && node seedData.js

# Install all dependencies
cd backend && npm install && cd ../frontend && npm install

# Check if MongoDB is running
# Windows: tasklist | findstr "mongod"
# Mac/Linux: pgrep mongod
```

## File Structure Quick Reference

```
luxury-hotel-management/
├── backend/           # Backend API
│   ├── models/       # Database schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth middleware
│   └── server.js     # Main server file
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # Auth context
│       └── utils/       # API utilities
└── Documentation files
```

## Next Steps

1. 📖 Read [README.md](README.md) for full documentation
2. 🎨 Customize the UI in `frontend/src/index.css`
3. 🏨 Add more rooms in `backend/seedData.js`
4. 🚀 Deploy using [DEPLOYMENT.md](DEPLOYMENT.md)

## Need More Help?

- **Setup Issues**: See [SETUP.md](SETUP.md)
- **API Reference**: See [API_REFERENCE.md](API_REFERENCE.md)
- **Features List**: See [FEATURES.md](FEATURES.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Ready to explore? Open http://localhost:3000 and start booking! 🏨✨**
