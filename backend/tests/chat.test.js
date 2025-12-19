const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../node');
const User = require('../model/usersigma');
const Chat = require('../model/chat');
const Message = require('../model/message');

describe('Chat API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/social_media_test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  describe('POST /api/chats', () => {
    let user1, user2;

    beforeEach(async () => {
      // Create test users
      user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });
      user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });
      await user1.save();
      await user2.save();
    });

    it('should create a new chat between users', async () => {
      const chatData = {
        participants: [user1._id, user2._id]
      };

      const response = await request(app)
        .post('/api/chats')
        .send(chatData)
        .expect(200);

      expect(response.body.chat).toBeDefined();
      expect(response.body.chat.participants).toHaveLength(2);

      // Verify chat was saved in database
      const savedChat = await Chat.findById(response.body.chat._id);
      expect(savedChat).toBeTruthy();
      expect(savedChat.participants).toHaveLength(2);
    });

    it('should return existing chat if one already exists', async () => {
      // Create a chat first
      const existingChat = new Chat({
        participants: [user1._id, user2._id]
      });
      await existingChat.save();

      const chatData = {
        participants: [user1._id, user2._id]
      };

      const response = await request(app)
        .post('/api/chats')
        .send(chatData)
        .expect(200);

      expect(response.body.chat._id).toBe(existingChat._id.toString());
    });
  });

  describe('GET /api/chats/:userId', () => {
    let user1, user2, chat;

    beforeEach(async () => {
      // Create test users
      user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });
      user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });
      await user1.save();
      await user2.save();

      // Create a chat
      chat = new Chat({
        participants: [user1._id, user2._id]
      });
      await chat.save();
    });

    it('should get chats for a user', async () => {
      const response = await request(app)
        .get(`/api/chats/${user1._id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].participants).toHaveLength(2);
    });

    it('should return empty array for user with no chats', async () => {
      const user3 = new User({
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });
      await user3.save();

      const response = await request(app)
        .get(`/api/chats/${user3._id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/messages/:chatId', () => {
    let user1, user2, chat, message;

    beforeEach(async () => {
      // Create test users
      user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });
      user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });
      await user1.save();
      await user2.save();

      // Create a chat
      chat = new Chat({
        participants: [user1._id, user2._id]
      });
      await chat.save();

      // Create a message
      message = new Message({
        chatId: chat._id,
        sender: user1._id,
        content: 'Hello, world!',
        messageType: 'text',
        timestamp: new Date()
      });
      await message.save();
    });

    it('should get messages for a chat', async () => {
      const response = await request(app)
        .get(`/api/messages/${chat._id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].content).toBe('Hello, world!');
      expect(response.body[0].sender).toBeDefined();
    });

    it('should return empty array for chat with no messages', async () => {
      const emptyChat = new Chat({
        participants: [user1._id]
      });
      await emptyChat.save();

      const response = await request(app)
        .get(`/api/messages/${emptyChat._id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/messages', () => {
    beforeEach(async () => {
      // Create test users
      const user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });
      const user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });
      await user1.save();
      await user2.save();

      // Create a chat
      const chat = new Chat({
        participants: [user1._id, user2._id]
      });
      await chat.save();

      // Create messages
      const message1 = new Message({
        chatId: chat._id,
        sender: user1._id,
        content: 'Hello!',
        messageType: 'text',
        timestamp: new Date()
      });
      const message2 = new Message({
        chatId: chat._id,
        sender: user2._id,
        content: 'Hi there!',
        messageType: 'text',
        timestamp: new Date()
      });
      await message1.save();
      await message2.save();
    });

    it('should get all messages', async () => {
      const response = await request(app)
        .get('/api/messages')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });
});
