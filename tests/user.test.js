// tests/user.test.js
const request = require('supertest');
const app = require('../src/index'); // Assuming your Express app is exported from src/index.js

describe('User Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Perform a login to get a valid JWT token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    authToken = loginResponse.body.token;
  });

  it('should get all users (protected route)', async () => {
    const response = await request(app)
      .get('/user/get-all')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    // Add more assertions based on your response structure
  });

  // Add more tests as needed
});
