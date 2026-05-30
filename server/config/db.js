const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const getMongoUri = async () => {
  if (process.env.MONGO_URI) {
    console.log('MONGO_URI detected in environment');
    return process.env.MONGO_URI;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI is not set');
  }

  console.log('No MONGO_URI provided; starting in-memory MongoDB for development/test');
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
};

mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const mongoUri = await getMongoUri();

  mongoose.connection.on('connected', () => {
    console.log('Mongoose event: connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`Mongoose event: error - ${error.message}`);
  });

  // Attempt to connect using sane production-friendly timeouts
  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    // keepAlive defaults are fine
  });

  console.log('MongoDB connected');
};

connectDB.stopMemoryServer = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
};

module.exports = connectDB;