import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}; 