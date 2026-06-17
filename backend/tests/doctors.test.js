const request = require('supertest');
const { createApp } = require('../src/server');

describe('GET /api/doctors', () => {
  it('returns the list of doctors from the database', async () => {
    const fakeRows = [
      { id: 1, first_name: 'Marie', last_name: 'Dubois', specialty: 'Médecine générale' },
      { id: 2, first_name: 'Jean', last_name: 'Martin', specialty: 'Cardiologie' },
    ];

    const pool = {
      query: jest.fn().mockResolvedValue({ rows: fakeRows }),
    };

    const app = createApp(pool);
    const res = await request(app).get('/api/doctors');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRows);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when the database fails', async () => {
    const pool = {
      query: jest.fn().mockRejectedValue(new Error('DB down')),
    };

    // The error middleware logs to console.error - silence it for this test
    // since we are deliberately triggering the error path.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const app = createApp(pool);
    const res = await request(app).get('/api/doctors');

    expect(res.status).toBe(500);

    errorSpy.mockRestore();
  });
});
