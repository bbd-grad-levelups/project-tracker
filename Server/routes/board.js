var express = require('express');
var router = express.Router();

const { pull_jira_data, extract_issue_count, extract_users } = require('../Utils/Jira.js');
const { get_project_access } = require('../Utils/AccessControl.js');

router.get('/summary', function(req, res) {
  const project = req.query.projectName;
  const board = req.query.boardName;
  const user = req.user.UID;

  get_project_access(user, project)
  .then((answer) => {
    const apiUser = answer.user;
    const apiToken = answer.token;
    const apiProject = answer.project;

    pull_jira_data(
      apiProject,
      board,
      apiUser,
      apiToken
    )
    .then((data) => {
      let issues = extract_issue_count(data);
      let users = extract_users(data);

      res.send({ 
        summary: issues, 
        users: users
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing your request.', specific: error});
    });

  })
  .catch((error) => {
    res.status(403).json({ error: error});
  });
});

module.exports = router;
