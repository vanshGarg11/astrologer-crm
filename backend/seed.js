const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const Astrologer = require('./models/Astrologer');
const Consultation = require('./models/Consultation');
const Customer = require('./models/Customer');
const User = require('./models/User');

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  await connectDB();
  await Promise.all([
    Astrologer.deleteMany(),
    Consultation.deleteMany(),
    Customer.deleteMany(),
    User.deleteMany(),
  ]);

  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@crm.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
  });

  const astrologers = await Astrologer.insertMany([
    {
      name: 'Ananya Sharma',
      specialization: 'Vedic Astrology',
      experience: 12,
      languages: 'Hindi, English',
      rating: 4.8,
      phone: '9876543210',
      email: 'ananya@example.com',
      status: 'Active',
    },
    {
      name: 'Rohan Mehta',
      specialization: 'Numerology',
      experience: 7,
      languages: 'English, Gujarati',
      rating: 4.4,
      phone: '9123456780',
      email: 'rohan@example.com',
      status: 'Active',
    },
    {
      name: 'Meera Iyer',
      specialization: 'Tarot Reading',
      experience: 9,
      languages: 'English, Tamil',
      rating: 4.7,
      phone: '9988776655',
      email: 'meera@example.com',
      status: 'Inactive',
    },
  ]);

  const customers = await Customer.insertMany([
    { name: 'Priya Kapoor', phone: '9012345678', email: 'priya@example.com', dob: '1994-05-11', city: 'Delhi' },
    { name: 'Arjun Rao', phone: '9090909090', email: 'arjun@example.com', dob: '1989-09-22', city: 'Mumbai' },
    { name: 'Neha Singh', phone: '8887776665', email: 'neha@example.com', dob: '1997-01-04', city: 'Bengaluru' },
  ]);

  await Consultation.insertMany([
    {
      customerId: customers[0].id,
      astrologerId: astrologers[0].id,
      consultationDate: addDays(1),
      consultationTime: '11:30',
      status: 'Pending',
      notes: 'Career reading and timing guidance.',
    },
    {
      customerId: customers[1].id,
      astrologerId: astrologers[1].id,
      consultationDate: addDays(-2),
      consultationTime: '16:00',
      status: 'Completed',
      notes: 'Name numerology session completed.',
    },
    {
      customerId: customers[2].id,
      astrologerId: astrologers[2].id,
      consultationDate: addDays(4),
      consultationTime: '10:00',
      status: 'Cancelled',
      notes: 'Customer requested cancellation.',
    },
  ]);

  console.log('MongoDB seed data inserted.');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
