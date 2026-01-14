// tests/setup.js
const mongoose = require('mongoose');

jest.mock('kafkajs', () => ({
  Kafka: jest.fn(() => ({
    producer: jest.fn(() => ({
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    })),
    consumer: jest.fn(() => ({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn(),
    })),
  })),
}));

process.env.NODE_ENV = 'test';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/social_media_test';

beforeAll(async () => {
  jest.setTimeout(60000);
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  // Remove dropDatabase()
  if (typeof redisClient !== 'undefined' && redisClient) {
    await redisClient.quit();
  }
});