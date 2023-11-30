// tests/auth.test.js
const request = require('supertest');
const app = require('../src/index'); // Assuming your Express app is exported from src/index.js

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  it('should fail to register with mismatched passwords', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        confirmPassword: 'mismatchedpassword',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Passwords do not match');
  });

  it('should fail to register with an existing username', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser', // Use the same username as in the first test
        email: 'another@example.com',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username or email already exists');
  });

  it('should fail to register with an existing email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'anotheruser',
        email: 'test@example.com', // Use the same email as in the first test
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username or email already exists');
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  it('should fail to login with incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'incorrectpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should fail to login with nonexistent email', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'anypassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  // Add more tests as needed
});
