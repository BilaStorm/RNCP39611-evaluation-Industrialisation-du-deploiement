const { createApp } = require('./server');
const { getPool } = require('./db');

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function main() {
  const pool = getPool();
  const app = createApp(pool);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[sanctuaire-sante-backend] API listening on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    // eslint-disable-next-line no-console
    console.log(`[sanctuaire-sante-backend] Received ${signal}, closing pool...`);
    try {
      await pool.end();
      process.exit(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[sanctuaire-sante-backend] Error closing pool', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[sanctuaire-sante-backend] Fatal error on startup', err);
  process.exit(1);
});
