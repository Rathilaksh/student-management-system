const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const getMongoUri = async () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI is not set');
  }

  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
};

const connectDB = async () => {
  const mongoUri = await getMongoUri();
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

connectDB.stopMemoryServer = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
};

module.exports = connectDB;