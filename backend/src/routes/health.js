const { Router } = require('express');

function buildHealthRouter() {
  const router = Router();

  router.get('/', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'sanctuaire-sante-backend',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}

module.exports = buildHealthRouter;
