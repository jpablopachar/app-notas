const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/acercaDe', (req, res) => {
  res.render('acercaDe');
});

module.exports = router;
