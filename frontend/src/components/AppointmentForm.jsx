import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const initialState = {
  doctor_id: '',
  patient_name: '',
  patient_email: '',
  appointment_date: '',
  reason: '',
};

export default function AppointmentForm({ onCreated }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    api.listDoctors().then(setDoctors).catch(() => setDoctors([]));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setSuccess(null);

    const payload = {
      doctor_id: parseInt(form.doctor_id, 10),
      patient_name: form.patient_name.trim(),
      patient_email: form.patient_email.trim(),
      appointment_date: form.appointment_date
        ? new Date(form.appointment_date).toISOString()
        : '',
      reason: form.reason.trim() || undefined,
    };

    try {
      const created = await api.createAppointment(payload);
      setSuccess(`Rendez-vous confirme (#${created.id}).`);
      setForm(initialState);
      if (typeof onCreated === 'function') onCreated(created);
    } catch (err) {
      if (err.body && Array.isArray(err.body.errors)) {
        setErrors(err.body.errors);
      } else {
        setErrors([err.message]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <label>
        Medecin
        <select
          required
          value={form.doctor_id}
          onChange={(e) => update('doctor_id', e.target.value)}
        >
          <option value="" disabled>
            -- Choisir un medecin --
          </option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr {doc.first_name} {doc.last_name} - {doc.specialty}
            </option>
          ))}
        </select>
      </label>

      <label>
        Nom complet
        <input
          type="text"
          required
          maxLength={200}
          value={form.patient_name}
          onChange={(e) => update('patient_name', e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          required
          value={form.patient_email}
          onChange={(e) => update('patient_email', e.target.value)}
        />
      </label>

      <label>
        Date et heure
        <input
          type="datetime-local"
          required
          value={form.appointment_date}
          onChange={(e) => update('appointment_date', e.target.value)}
        />
      </label>

      <label>
        Motif (optionnel)
        <textarea
          rows={3}
          maxLength={1000}
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Envoi...' : 'Prendre rendez-vous'}
      </button>

      {success && <p className="success">{success}</p>}
      {errors.length > 0 && (
        <ul className="error">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
