import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Room from './models/Room.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    phone: '+91 9876543210',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    phone: '+91 9876543211',
    role: 'user'
  }
];

const rooms = [
  {
    roomNumber: '101',
    roomType: 'Deluxe',
    price: 5000,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service'],
    description: 'Elegant deluxe room with modern amenities and stunning city views. Perfect for couples seeking comfort and luxury.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '201',
    roomType: 'Suite',
    price: 10000,
    capacity: 3,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony'],
    description: 'Luxurious suite with separate living area, private balcony, and premium amenities for an unforgettable experience.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '301',
    roomType: 'Presidential',
    price: 25000,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Private Pool', 'Butler Service'],
    description: 'The epitome of luxury. Presidential suite with panoramic views, private pool, and personalized butler service.',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '102',
    roomType: 'Standard',
    price: 3000,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Smart TV'],
    description: 'Comfortable standard room with essential amenities. Great value for budget-conscious travelers.',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '202',
    roomType: 'Executive',
    price: 8000,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Work Desk', 'Coffee Maker'],
    description: 'Executive room designed for business travelers with dedicated workspace and premium connectivity.',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '103',
    roomType: 'Deluxe',
    price: 5500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Garden View'],
    description: 'Deluxe room overlooking lush gardens, offering tranquility and modern comfort.',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '203',
    roomType: 'Suite',
    price: 12000,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Dining Area'],
    description: 'Spacious family suite with separate rooms and dining area. Perfect for families and groups.',
    images: [
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '104',
    roomType: 'Standard',
    price: 3500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Coffee Maker'],
    description: 'Cozy standard room with modern furnishings and all essential comforts.',
    images: [
      'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ],
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();

    console.log('Data cleared!');

    // Insert users one by one to trigger password hashing
    for (const userData of users) {
      await User.create(userData);
    }
    console.log('Users seeded!');

    // Insert rooms
    await Room.insertMany(rooms);
    console.log('Rooms seeded!');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
