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
  },
  {
    roomNumber: '105',
    roomType: 'Deluxe',
    price: 5200,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Sea View'],
    description: 'Deluxe room with breathtaking sea views and premium bedding for ultimate relaxation.',
    images: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '106',
    roomType: 'Standard',
    price: 3200,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Room Service'],
    description: 'Well-appointed standard room perfect for short stays and weekend getaways.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '107',
    roomType: 'Deluxe',
    price: 5800,
    capacity: 3,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Sofa Bed', 'Work Desk'],
    description: 'Spacious deluxe room with sofa bed, ideal for small families or business travelers.',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '108',
    roomType: 'Executive',
    price: 7500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Work Desk', 'Coffee Maker', 'Printer'],
    description: 'Executive room with business amenities including printer and high-speed internet.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '204',
    roomType: 'Suite',
    price: 11000,
    capacity: 3,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'City View'],
    description: 'Luxurious suite with panoramic city views and private jacuzzi.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '205',
    roomType: 'Executive',
    price: 8500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Work Desk', 'Coffee Maker', 'Lounge Access'],
    description: 'Executive room with complimentary lounge access and business facilities.',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '206',
    roomType: 'Deluxe',
    price: 6000,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Bathtub', 'Premium Toiletries'],
    description: 'Deluxe room featuring a luxurious bathtub and premium toiletries.',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '207',
    roomType: 'Suite',
    price: 13000,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Dining Area', 'Kitchen'],
    description: 'Premium suite with full kitchen, dining area, and spacious living room.',
    images: [
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '208',
    roomType: 'Deluxe',
    price: 5600,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Mountain View'],
    description: 'Deluxe room with stunning mountain views and peaceful ambiance.',
    images: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '302',
    roomType: 'Presidential',
    price: 28000,
    capacity: 5,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Private Pool', 'Butler Service', 'Home Theater', 'Gym'],
    description: 'Ultra-luxury presidential suite with private gym, home theater, and exclusive butler service.',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '303',
    roomType: 'Suite',
    price: 14000,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Dining Area', 'Game Room'],
    description: 'Family suite with game room and entertainment options for all ages.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '304',
    roomType: 'Executive',
    price: 9000,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Work Desk', 'Coffee Maker', 'Meeting Room Access'],
    description: 'Executive room with access to private meeting rooms and business center.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '305',
    roomType: 'Deluxe',
    price: 6200,
    capacity: 3,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Balcony', 'Extra Bed'],
    description: 'Deluxe room with private balcony and option for extra bed.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '401',
    roomType: 'Penthouse',
    price: 35000,
    capacity: 6,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Private Pool', 'Butler Service', 'Home Theater', 'Gym', 'Rooftop Terrace', 'Wine Cellar'],
    description: 'Exclusive penthouse suite with rooftop terrace, private pool, wine cellar, and 360-degree views.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '402',
    roomType: 'Suite',
    price: 15000,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Dining Area', 'Piano Room'],
    description: 'Elegant suite with grand piano and sophisticated decor for music enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '403',
    roomType: 'Executive',
    price: 8800,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Work Desk', 'Coffee Maker', 'Ergonomic Chair'],
    description: 'Executive room designed for productivity with ergonomic furniture.',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '404',
    roomType: 'Deluxe',
    price: 6500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Spa Bath', 'Aromatherapy'],
    description: 'Deluxe room with spa bath and aromatherapy for ultimate relaxation.',
    images: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    isAvailable: true
  },
  {
    roomNumber: '405',
    roomType: 'Suite',
    price: 12500,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Room Service', 'Jacuzzi', 'Balcony', 'Dining Area', 'Library'],
    description: 'Suite with private library, perfect for guests who enjoy reading in luxury.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800'
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
