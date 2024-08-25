import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global type
declare global {
  var mongoose: Cached | undefined;
}

let cached: Cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
  console.log('Initialized global mongoose cache');
}

async function dbConnect(): Promise<typeof mongoose> {
  console.log('Attempting database connection...');

  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new database connection promise');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Database connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('Error connecting to database:', error);
      throw error;
    });
  } else {
    console.log('Using existing database connection promise');
  }

  try {
    console.log('Awaiting database connection...');
    cached.conn = await cached.promise;
    console.log('Database connection established');
  } catch (e) {
    console.error('Error establishing database connection:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;