# Quick Testing Guide
## Test Bookings & Food Orders

---

## 🧪 Test 1: User Creates a Booking

1. **Go to:** http://localhost:3000
2. **Login/Register** as a regular user
3. **Browse rooms** and click on any room
4. **Fill booking form:**
   - Select check-in and check-out dates
   - Enter number of guests
   - Choose payment method
5. **Submit booking**
6. **Expected:** Booking confirmation page shows with booking ID

### Verify in Database:
- Open admin dashboard
- Check if the new booking appears in the bookings table
- Verify user details, room info, dates, and amount are displayed

---

## 🧪 Test 2: Admin Views All Bookings

1. **Go to:** http://localhost:3000/admin/login
2. **Login with admin credentials** (from CREDENTIALS.txt)
3. **You should see:**
   - Statistics cards (Total, Confirmed, Cancelled, Revenue)
   - All bookings in a table
   - Search bar and status filter
4. **Try:**
   - Search by booking ID or guest name
   - Filter by status (Confirmed/Cancelled/Completed)
   - Clear filters

### Expected Results:
- ✅ All bookings from database are displayed
- ✅ User information is populated (name, email, phone)
- ✅ Room information is populated (type, number)
- ✅ Statistics update based on bookings
- ✅ Search and filters work correctly

---

## 🧪 Test 3: User Orders Food

1. **Login as regular user** (not admin)
2. **Go to:** Room Service / Food Order page
3. **Add items to cart:**
   - Browse food menu
   - Add quantities
   - Add special instructions (optional)
4. **Enter room number**
5. **Place order**
6. **Expected:** Order confirmation with Order ID

---

## 🧪 Test 4: Admin Accepts/Updates Food Orders ⭐

1. **Go to:** http://localhost:3000/admin/login
2. **Login as admin**
3. **Navigate to "Food Orders"** in admin menu
4. **You should see:**
   - Statistics (Total Orders, Pending, Delivered, Revenue)
   - All food orders in a table
   - Each order shows:
     - Order ID
     - Room number
     - Guest details
     - Items ordered
     - Amount
     - Current status
     - **Action dropdown** ⭐

### Testing Admin Accept Feature:

**Step-by-step:**

1. **Find a "Pending" order** in the table
2. **In the "Action" column**, you'll see a dropdown
3. **Current status** is displayed (e.g., "Pending")
4. **Click the dropdown** and select:
   - "Preparing" → To accept and start preparing
   - "Delivered" → To mark as completed
   - "Cancelled" → To cancel the order
5. **As soon as you select**, the status updates:
   - ✅ Success notification appears
   - ✅ Order status badge changes color
   - ✅ Statistics update automatically
   - ✅ Database is updated

**Status Flow:**
```
Pending → Preparing → Delivered
         ↓
      Cancelled
```

**Visual Indicators:**
- 🟡 **Pending** = Yellow badge
- 🔵 **Preparing** = Blue badge
- 🟢 **Delivered** = Green badge
- 🔴 **Cancelled** = Red badge

### Expected Behavior:
- ✅ Dropdown only shows on non-final orders (not Delivered/Cancelled)
- ✅ Status changes immediately
- ✅ Success toast notification appears
- ✅ Statistics recalculate automatically
- ✅ User sees the updated status on their orders page

---

## 🧪 Test 5: Verify Database Updates

### For Bookings:
1. User creates booking
2. Open admin dashboard
3. **Verify:** New booking appears instantly
4. **Check:** All details match (dates, amount, guest info)

### For Food Orders:
1. User places food order
2. Open admin food orders page
3. **Verify:** New order appears with "Pending" status
4. Admin changes status to "Preparing"
5. **Go to user's "My Orders" page**
6. **Verify:** Status changed to "Preparing" (with blue badge)
7. Admin changes to "Delivered"
8. **Refresh user page**
9. **Verify:** Status now shows "Delivered" (green badge)

---

## 🔍 Search & Filter Testing

### Admin Dashboard - Bookings:
- **Search by:**
  - Booking ID (e.g., "BK...")
  - Guest name
  - Email
  - Room number
- **Filter by:**
  - Confirmed
  - Cancelled
  - Completed
  - All Status

### Admin Food Orders:
- **Search by:**
  - Order ID (e.g., "FO...")
  - Room number
  - Guest name
  - Guest email
- **Filter by:**
  - Pending
  - Preparing
  - Delivered
  - Cancelled
  - All Status

---

## 📊 Statistics Testing

### Admin Dashboard Stats:
1. Note current statistics
2. Create a new booking as user
3. Refresh admin dashboard
4. **Verify:** 
   - Total Bookings increased by 1
   - Confirmed Bookings increased by 1
   - Total Revenue increased by booking amount

### Food Orders Stats:
1. Note current statistics
2. Place a food order as user
3. Refresh admin food orders page
4. **Verify:**
   - Total Orders increased by 1
   - Pending Orders increased by 1
5. Change status to "Delivered"
6. **Verify:**
   - Pending Orders decreased by 1
   - Delivered Orders increased by 1
   - Total Revenue increased by order amount

---

## ✅ Success Criteria

**All tests pass if:**
- ✅ Users can create bookings
- ✅ Bookings appear in admin dashboard
- ✅ All user and room data is displayed correctly
- ✅ Users can place food orders
- ✅ Orders appear in admin food orders page
- ✅ **Admin can change order status using dropdown** ⭐
- ✅ Status updates save to database
- ✅ Status changes are visible to users
- ✅ Search and filters work on both pages
- ✅ Statistics calculate and update correctly
- ✅ Success/error notifications work

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot access 'applyFilters' before initialization"
**Status:** ✅ FIXED
**Solution:** Functions moved before useEffect hooks

### Issue: Data not showing in admin dashboard
**Check:**
- Backend server is running (http://localhost:5000)
- MongoDB is connected
- User is logged in as admin
- JWT token is valid

### Issue: Status not updating
**Check:**
- Admin role is correct
- Token is valid
- Network request succeeds (check browser console)
- Backend server is running

---

## 🎯 Key Feature Verification

**✅ Bookings Save to Database:**
- Check: Create booking → View in admin dashboard → Data matches

**✅ Bookings Fetched in Admin Dashboard:**
- Check: All bookings from DB appear → Proper population → Search works

**✅ Food Orders Save to Database:**
- Check: Place order → View in admin food orders → Data matches

**✅ Admin Can Accept Food Orders:**
- Check: See pending order → Use dropdown → Select "Preparing" → Status updates → Success notification → User sees change

---

**Ready to test! Both systems are fully operational.** 🚀
