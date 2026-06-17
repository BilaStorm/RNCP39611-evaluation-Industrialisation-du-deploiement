import { useState } from 'react';
import DoctorList from './components/DoctorList.jsx';
import AppointmentForm from './components/AppointmentForm.jsx';
import './App.css';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAppointmentCreated() {
    // For demo purposes - could re-fetch appointments here.
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sanctuaire Sante</h1>
        <p>Portail patient - prise de rendez-vous en ligne</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Nos medecins</h2>
          <DoctorList />
        </section>

        <section className="card">
          <h2>Prendre un rendez-vous</h2>
          <AppointmentForm
            key={refreshKey}
            onCreated={handleAppointmentCreated}
          />
        </section>
      </main>

      <footer className="app-footer">
        <small>
          Sanctuaire Sante &middot; Donnees patients - traitement conforme RGPD
        </small>
      </footer>
    </div>
  );
}
