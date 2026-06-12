const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>')) {
    throw new Error('Set MONGO_URI in backend/.env to your MongoDB Atlas connection string.');
  }

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
