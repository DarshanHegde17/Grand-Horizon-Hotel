import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const testLogin = async () => {
  try {
    await connectDB();

    console.log('\n========== TESTING LOGIN ==========\n');
    
    const email = 'admin@gmail.com';
    const password = 'admin123';
    
    console.log(`Testing login with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('');
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with this email!');
    } else {
      console.log('✅ User found in database');
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log('');
      
      const isMatch = await user.matchPassword(password);
      
      if (isMatch) {
        console.log('✅ Password is CORRECT!');
        console.log('Login should work perfectly.');
      } else {
        console.log('❌ Password is INCORRECT!');
        console.log('The password in database does not match.');
      }
    }
    
    console.log('\n===================================\n');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

testLogin();
