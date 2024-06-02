var express = require('express');
const { get_project_access } = require('../Utils/AccessControl');
var router = express.Router();

// Add user to project
router.get('/add', function(req, res) {
  const project = req.query.projectName;
  const newUser = req.query.userName;
  const user = req.query.username;

  get_project_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `
      INSERT INTO user_project
      (project_id, role_id, user_id)
      VALUES (
        @Project,
        (SELECT user_id FROM [user] WHERE userName = @User),
        (SELECT role_id FROM role WHERE description = 'User')
      )
    `;

    pool.request()
    .input('Project', projectID)
    .input('User', newUser)
    .query(query)
    .then(() => {
      res.send({ message: "User has been succesfully added to project!"});
    })
    .catch((error) => {
      console.log("Issue adding user to project: " + error);
      res.status(500).json({ error: `An issue occurred while attempting to add a user to ${project}`});
    });

  })
  .catch((error) => {
    console.log("User without access tried to add a user: " + error);
    res.status(403).json({ error: "Unauthorised access"});
  });

});

// Remove user from project
router.get('/remove', function(req, res) {
  const project = req.query.projectName;
  const oldUser = req.query.userName;
  const user = req.query.username;

  get_project_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `
      DELETE FROM user_project
      WHERE user_id = (SELECT user_id FROM [user] WHERE userName = @User),
    `;

    pool.request()
    .input('Project', projectID)
    .input('User', oldUser)
    .query(query)
    .then(() => {
      res.send({ message: "User has been succesfully removed from project!"});
    })
    .catch((error) => {
      console.log("Issue removing user from project: " + error);
      res.status(500).json({ error: `An issue occurred while attempting to remove a user from ${project}`});
    });

  })
  .catch((error) => {
    console.log("User without access tried to remove a user: " + error);
    res.status(403).json({ error: "Unauthorised access"});
  });

});

module.exports = router;
