const { Pool } = require('pg');

let cachedPool = null;

/**
 * Lazily build a pg Pool from environment variables.
 *
 * Variables consumed:
 *   - DATABASE_URL (preferred)
 *   - or PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
 */
function getPool() {
  if (cachedPool) {
    return cachedPool;
  }

  const connectionString = process.env.DATABASE_URL;

  cachedPool = connectionString
    ? new Pool({ connectionString })
    : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      user: process.env.PGUSER || 'sanctuaire',
      password: process.env.PGPASSWORD || 'sanctuaire',
      database: process.env.PGDATABASE || 'sanctuaire',
      max: 10,
    });

  return cachedPool;
}

module.exports = { getPool };
