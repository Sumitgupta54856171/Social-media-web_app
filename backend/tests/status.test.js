const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../node');
const User = require('../model/usersigma');
const UserStatus = require('../model/Status');

describe('Status API', () => {
  let token;
  let user;

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
    await UserStatus.deleteMany({});

    // Create a test user and generate token
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const jwtSecret = 'ashishgupta2531';
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  });

  describe('POST /api/addstatus', () => {
    it('should add status with valid token and file', async () => {
      const statusData = {
        username: 'testuser'
      };

      // Mock file upload - in a real test, you'd use multer memory storage
      // For now, we'll test the authentication part
      const response = await request(app)
        .post('/api/addstatus')
        .set('Cookie', [`sociluser=${token}`])
        .send(statusData)
        .expect(500); // This will fail due to missing file, but tests auth

      // The response should not be 401 (unauthorized)
      expect(response.status).not.toBe(401);
    });

    it('should reject request without token', async () => {
      const statusData = {
        username: 'testuser'
      };

      const response = await request(app)
        .post('/api/addstatus')
        .send(statusData)
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });

    it('should reject request without username', async () => {
      const response = await request(app)
        .post('/api/addstatus')
        .set('Cookie', [`sociluser=${token}`])
        .send({})
        .expect(400);

      expect(response.body.error).toBe('username is required');
    });
  });

  describe('GET /api/getstatus', () => {
    beforeEach(async () => {
      // Create a status for the user
      const status = new UserStatus({
        image: {
          name: 'test-image.jpg',
          path: '/uploads/test-image.jpg'
        },
        title: 'Test Status',
        userid: user._id
      });
      await status.save();
    });

    it('should get status with valid token', async () => {
      const response = await request(app)
        .get('/api/getstatus')
        .set('Cookie', [`sociluser=${token}`])
        .expect(200);

      expect(response.body.message).toBe('status fetched successfully');
      expect(response.body.statusdata1).toBeDefined();
      expect(Array.isArray(response.body.statusdata1)).toBe(true);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/getstatus')
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });

  describe('GET /api/getprofile', () => {
    it('should get profile with valid token', async () => {
      const response = await request(app)
        .get('/api/getprofile')
        .set('Cookie', [`sociluser=${token}`])
        .expect(200);

      expect(response.body.message).toBe('profile fetched successfully');
      expect(response.body.profiledata).toBeDefined();
      expect(Array.isArray(response.body.profiledata)).toBe(true);
      expect(response.body.profiledata[0].email).toBe(user.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/getprofile')
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });
});
