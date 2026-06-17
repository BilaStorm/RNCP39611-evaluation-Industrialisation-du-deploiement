const request = require('supertest');
const { createApp } = require('../src/server');

describe('GET /health', () => {
  const app = createApp({ query: jest.fn() });

  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('sanctuaire-sante-backend');
    expect(typeof res.body.timestamp).toBe('string');
  });
});
