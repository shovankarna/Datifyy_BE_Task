// tests/rateLimit.test.js
const request = require('supertest');
const app = require('../src/index');

describe('Rate Limiting', () => {
  it('should enforce rate limiting on the /get-all-test route', async () => {
    // Make multiple requests within a short time frame
    const responses = await Promise.all(
      Array.from({ length: 5 }).map(() => request(app).get('/user/get-all-test'))
    );

    // All responses should be 429 (Too Many Requests) except the last one
    responses.forEach((response, index) => {
      if (index === responses.length - 1) {
        expect(response.statusCode).not.toBe(429); // The last request should not be rate-limited
      } else {
        expect(response.statusCode).toBe(429); // The previous requests should be rate-limited
      }
    });
  });

  // Add more tests as needed
});
