var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/world', (req, res) => {
  res.send('HELLO WORLD');
});

module.exports = router;
