var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('yess')
  res.send({message: "Hola mundo"})
});

module.exports = router;
