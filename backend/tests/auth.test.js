const request = require('supertest');
const app = require('../server');

describe('Auth Routes (Unauthenticated Paths)', () => {
  it('rejects invalid registration payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    // Only expect 400 or 422 for invalid payload
    expect([400, 422]).toContain(res.status);
  });

  it('rejects login with missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    // Only expect 400, 401, or 422 for missing credentials
    expect([400, 401, 422]).toContain(res.status);
  });
});
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  describe('POST /auth/login', () => {
    it('should return 400 for missing credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({});
      expect([400, 401, 422]).toContain(res.statusCode);
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'invalid', password: 'wrong' });
      expect([400, 401, 422]).toContain(res.statusCode);
    });
  });

  describe('POST /auth/register', () => {
    it('should return 400 for missing registration data', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({});
      expect([400, 401, 422]).toContain(res.statusCode);
    });
  });
});
