const { Router } = require('express');
const { validateAppointment } = require('../validation/appointment');

function buildAppointmentsRouter(pool) {
  const router = Router();

  router.post('/', async (req, res, next) => {
    const errors = validateAppointment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { doctor_id, patient_name, patient_email, appointment_date, reason } = req.body;

    try {
      const { rows } = await pool.query(
        `INSERT INTO appointments
           (doctor_id, patient_name, patient_email, appointment_date, reason)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, doctor_id, patient_name, patient_email, appointment_date, reason, created_at`,
        [doctor_id, patient_name, patient_email, appointment_date, reason || null]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      // Foreign key violation = unknown doctor
      if (err && err.code === '23503') {
        return res.status(400).json({ errors: ['Unknown doctor_id'] });
      }
      return next(err);
    }
  });

  return router;
}

module.exports = buildAppointmentsRouter;
