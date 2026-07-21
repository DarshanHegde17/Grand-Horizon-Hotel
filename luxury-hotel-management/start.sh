#!/bin/bash

echo "========================================"
echo " Luxury Hotel Management System"
echo " Quick Start Script"
echo "========================================"
echo ""

# Check if MongoDB is running
echo "[1/4] Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null
then
    echo "Starting MongoDB..."
    # Try to start MongoDB based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mongodb-community
    else
        # Linux
        sudo systemctl start mongod
    fi
    sleep 2
else
    echo "MongoDB is already running"
fi

echo ""
echo "[2/4] Starting Backend Server..."
cd backend
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
cd ..

sleep 3

echo ""
echo "[3/4] Starting Frontend Server..."
cd frontend
npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"
cd ..

sleep 5

echo ""
echo "[4/4] Opening Browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
else
    # Linux
    xdg-open http://localhost:3000 2>/dev/null
fi

echo ""
echo "========================================"
echo " All services started successfully!"
echo "========================================"
echo ""
echo " Frontend: http://localhost:3000"
echo " Backend:  http://localhost:5000"
echo ""
echo " Demo Credentials:"
echo " Admin: admin@luxuryhotel.com / admin123"
echo " User:  john@example.com / 123456"
echo ""
echo " To stop servers:"
echo " kill $BACKEND_PID $FRONTEND_PID"
echo "========================================"
echo ""
