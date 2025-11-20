const request = require('supertest');
const app = require('../server');

describe('Health Endpoint', () => {
  it('returns successful health payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('returns pong on /api/ping', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'pong');
  });
});
