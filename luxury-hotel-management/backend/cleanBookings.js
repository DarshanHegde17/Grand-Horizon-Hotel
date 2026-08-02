import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

const cleanBookings = async () => {
  try {
    await connectDB();

    console.log('\n========== CLEANING ORPHANED BOOKINGS ==========\n');
    
    // Delete all bookings (since we just re-seeded users and rooms)
    const result = await Booking.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} bookings`);
    console.log('Database is now clean!');
    console.log('\nYou can now make new bookings with valid user and room references.');
    
    console.log('\n==============================================\n');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

cleanBookings();
