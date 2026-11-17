const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`, { cause: err });
  }
};

module.exports = connectDB;