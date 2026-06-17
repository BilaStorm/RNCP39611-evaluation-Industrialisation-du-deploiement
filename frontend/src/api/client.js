const API_BASE = '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      (body && (body.error || (body.errors && body.errors.join(', ')))) ||
      `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export const api = {
  listDoctors: () => request('/api/doctors'),
  createAppointment: (payload) =>
    request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
