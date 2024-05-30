var express = require('express');
var router = express.Router();

// Add user to project
router.get('/add', function(req, res) {
  const project = req.query.projectName;
  const newUser = req.query.userName;
  const user = req.query.username;

  


  res.json({ user: user});
});

// Remove user from project
router.get('/remove', function(req, res) {

});

module.exports = router;
