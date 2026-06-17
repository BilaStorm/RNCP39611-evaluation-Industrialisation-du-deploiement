const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the payload of a POST /api/appointments request.
 *
 * @param {object} body
 * @returns {string[]} list of error messages, empty if valid
 */
function validateAppointment(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Body must be a JSON object'];
  }

  if (!Number.isInteger(body.doctor_id) || body.doctor_id <= 0) {
    errors.push('doctor_id must be a positive integer');
  }

  if (typeof body.patient_name !== 'string' || body.patient_name.trim().length === 0) {
    errors.push('patient_name is required');
  } else if (body.patient_name.length > 200) {
    errors.push('patient_name must be at most 200 characters');
  }

  if (typeof body.patient_email !== 'string' || !EMAIL_REGEX.test(body.patient_email)) {
    errors.push('patient_email must be a valid email address');
  }

  if (typeof body.appointment_date !== 'string') {
    errors.push('appointment_date is required (ISO 8601 string)');
  } else {
    const ts = Date.parse(body.appointment_date);
    if (Number.isNaN(ts)) {
      errors.push('appointment_date must be a valid ISO 8601 date');
    }
  }

  if (body.reason !== undefined && body.reason !== null) {
    if (typeof body.reason !== 'string') {
      errors.push('reason must be a string');
    } else if (body.reason.length > 1000) {
      errors.push('reason must be at most 1000 characters');
    }
  }

  return errors;
}

module.exports = { validateAppointment };
