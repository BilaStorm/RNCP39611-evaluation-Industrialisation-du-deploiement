-- =========================================================================
-- Sanctuaire Sante - schema d'initialisation PostgreSQL
-- =========================================================================
-- Ce script est idempotent : il peut etre execute plusieurs fois sans erreur.
-- =========================================================================

CREATE TABLE IF NOT EXISTS doctors (
  id          SERIAL PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  specialty   VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id                SERIAL PRIMARY KEY,
  doctor_id         INTEGER NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  patient_name      VARCHAR(200) NOT NULL,
  patient_email     VARCHAR(200) NOT NULL,
  appointment_date  TIMESTAMPTZ NOT NULL,
  reason            TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id
  ON appointments(doctor_id);

CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date
  ON appointments(appointment_date);

-- Seed de medecins (idempotent grace au filtre WHERE NOT EXISTS).
INSERT INTO doctors (first_name, last_name, specialty)
SELECT v.first_name, v.last_name, v.specialty
FROM (VALUES
  ('Marie',  'Dubois',  'Medecine generale'),
  ('Jean',   'Martin',  'Cardiologie'),
  ('Sophie', 'Bernard', 'Pediatrie'),
  ('Pierre', 'Lefevre', 'Dermatologie')
) AS v(first_name, last_name, specialty)
WHERE NOT EXISTS (
  SELECT 1
  FROM doctors d
  WHERE d.first_name = v.first_name
    AND d.last_name  = v.last_name
);
