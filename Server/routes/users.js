const { pool } = require('../db');

var express = require('express');
const { get_project_access } = require('../Utils/AccessControl');
var router = express.Router();

router.get('/add', function(req, res) {
  const project = req.query.projectName;
  const newUser = req.query.userEmail;
  const user = req.user.UID;

  get_project_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `
      INSERT INTO user_project
      (project_id, role_id, user_id)
      VALUES (
        @Project,
        (SELECT role_id FROM role WHERE description = 'User'),
        (SELECT user_id FROM [user] WHERE email = @User)
      )
    `;

    pool.request()
    .input('Project', projectID)
    .input('User', newUser)
    .query(query)
    .then(() => {
      res.send({ message: "If the user exists, they have been invited to your project."});
    })
    .catch((error) => {
      res.status(500).json({ error: `An issue occurred while attempting to add a user to ${project}`});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

router.get('/remove', function(req, res) {
  const project = req.query.projectName;
  const oldUser = req.query.userID;
  const user = req.query.UID;

  get_project_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `
      DELETE FROM user_project
      WHERE user_id = @User
    `;

    pool.request()
    .input('Project', projectID)
    .input('User', oldUser)
    .query(query)
    .then(() => {
      res.send({ message: "If the user was part of your project, they have been removed."});
    })
    .catch((error) => {
      res.status(500).json({ error: `An issue occurred while attempting to remove a user from ${project}`});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

module.exports = router;
