import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listDoctors()
      .then((data) => {
        if (!cancelled) {
          setDoctors(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Chargement de la liste des medecins...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;
  if (doctors.length === 0) return <p>Aucun medecin disponible.</p>;

  return (
    <ul className="doctor-list">
      {doctors.map((doc) => (
        <li key={doc.id} className="doctor-item">
          <strong>
            Dr {doc.first_name} {doc.last_name}
          </strong>
          <span className="specialty">{doc.specialty}</span>
        </li>
      ))}
    </ul>
  );
}
