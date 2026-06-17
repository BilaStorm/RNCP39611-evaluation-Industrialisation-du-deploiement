const { Router } = require('express');

function buildDoctorsRouter(pool) {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, first_name, last_name, specialty FROM doctors ORDER BY last_name, first_name'
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = buildDoctorsRouter;
