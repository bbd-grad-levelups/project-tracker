var express = require('express');
var router = express.Router();

// Add user to project
router.get('/', function(req, res) {
  res.send("helth");
});

module.exports = router;
