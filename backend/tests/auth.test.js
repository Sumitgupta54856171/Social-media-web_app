const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../node'); // Make sure this exports the express app!
const User = require('../model/usersigma');

describe('Authentication API', () => {
  let testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  };

  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/register')
        .send(testUser)
        .expect(201);

      expect(response.text).toBe('User registered successfully');
    });

    it('should not register user with existing username/email', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send(testUser)
        .expect(201);

      // Second attempt — same data
      const duplicateResponse = await request(app)
        .post('/api/register')
        .send(testUser)
        .expect(400); // ← Fix your controller to return 400!

      expect(duplicateResponse.text).toMatch(/already exists/i);
    });

    it('should return 400 for missing required fields', async () => {
      const incomplete = {
        username: 'incomplete',
        // missing email & password
      };

      const response = await request(app)
        .post('/api/register')
        .send(incomplete)
        .expect(400); // ← Improve controller to return 400, not 500
    });
  });

  describe('POST /api/login', () => {
    let registeredUser;

    beforeEach(async () => {
      registeredUser = new User({
        username: `loginuser_${Date.now()}`,
        email: `login_${Date.now()}@example.com`,
        password: 'password123',
      });
      await registeredUser.save();
    });

    it('should login with correct credentials and set cookie', async () => {
      const loginData = {
        email: registeredUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toMatch(/sociluser=/); // or correct cookie name
    });

    it('should NOT login with wrong password → 401', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: registeredUser.email,
          password: 'wrongpass',
        })
        .expect(401); // ← Fix controller to return 401

      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should NOT login with non-existent email → 401', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'doesnot@exist.com',
          password: 'password123',
        })
        .expect(401); // ← Fix controller!

      expect(response.body.message).toMatch(/not found|invalid/i);
    });
  });

  describe('GET /api/verify', () => {
    it('should verify valid session/token', async () => {
      // Register + Login to get cookie
      const user = {
        username: `verify_${Date.now()}`,
        email: `verify_${Date.now()}@example.com`,
        password: 'password123',
      };

      await request(app).post('/api/register').send(user).expect(201);

      const loginRes = await request(app)
        .post('/api/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      const cookies = loginRes.headers['set-cookie'];

      const verifyRes = await request(app)
        .get('/api/verify')
        .set('Cookie', cookies)
        .expect(200);

      expect(verifyRes.body).toBeDefined();
      // Add more specific expectations depending on what /verify returns
    });

    it('should reject invalid/expired token', async () => {
      await request(app)
        .get('/api/verify')
        .set('Cookie', 'sociluser=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.token')
        .expect(401);
    });
  });
});
