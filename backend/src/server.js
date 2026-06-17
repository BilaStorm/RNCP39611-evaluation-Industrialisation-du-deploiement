const express = require('express');
const cors = require('cors');

const buildHealthRouter = require('./routes/health');
const buildDoctorsRouter = require('./routes/doctors');
const buildAppointmentsRouter = require('./routes/appointments');

/**
 * Build the Express application.
 *
 * The `pool` parameter is injected so that tests can pass a mocked pg pool
 * without opening a real database connection.
 *
 * @param {import('pg').Pool} pool - pg connection pool
 * @returns {import('express').Express}
 */
function createApp(pool) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '64kb' }));

  app.use('/health', buildHealthRouter());
  app.use('/api/doctors', buildDoctorsRouter(pool));
  app.use('/api/appointments', buildAppointmentsRouter(pool));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error('[sanctuaire-sante-backend] Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
