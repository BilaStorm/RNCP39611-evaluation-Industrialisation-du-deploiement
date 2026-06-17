const request = require('supertest');
const { createApp } = require('../src/server');
const { validateAppointment } = require('../src/validation/appointment');

describe('validateAppointment', () => {
  it('accepts a valid payload', () => {
    const errors = validateAppointment({
      doctor_id: 1,
      patient_name: 'Alice Durand',
      patient_email: 'alice@example.com',
      appointment_date: '2026-06-15T10:00:00.000Z',
      reason: 'Consultation de suivi',
    });

    expect(errors).toEqual([]);
  });

  it('rejects a payload missing required fields', () => {
    const errors = validateAppointment({});
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.includes('doctor_id'))).toBe(true);
    expect(errors.some((e) => e.includes('patient_name'))).toBe(true);
    expect(errors.some((e) => e.includes('patient_email'))).toBe(true);
    expect(errors.some((e) => e.includes('appointment_date'))).toBe(true);
  });

  it('rejects an invalid email', () => {
    const errors = validateAppointment({
      doctor_id: 1,
      patient_name: 'Alice',
      patient_email: 'not-an-email',
      appointment_date: '2026-06-15T10:00:00.000Z',
    });
    expect(errors.some((e) => e.includes('patient_email'))).toBe(true);
  });
});

describe('POST /api/appointments', () => {
  it('returns 400 with errors on invalid body', async () => {
    const pool = { query: jest.fn() };
    const app = createApp(pool);

    const res = await request(app)
      .post('/api/appointments')
      .send({})
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('returns 201 with the created appointment on valid body', async () => {
    const created = {
      id: 42,
      doctor_id: 1,
      patient_name: 'Alice Durand',
      patient_email: 'alice@example.com',
      appointment_date: '2026-06-15T10:00:00.000Z',
      reason: null,
      created_at: '2026-05-05T12:00:00.000Z',
    };

    const pool = {
      query: jest.fn().mockResolvedValue({ rows: [created] }),
    };
    const app = createApp(pool);

    const res = await request(app)
      .post('/api/appointments')
      .send({
        doctor_id: 1,
        patient_name: 'Alice Durand',
        patient_email: 'alice@example.com',
        appointment_date: '2026-06-15T10:00:00.000Z',
      })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
