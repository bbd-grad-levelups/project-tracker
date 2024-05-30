var express = require('express');
var router = express.Router();

const { pool } = require('../db');
const { get_project_access} = require('../Utils/AccessControl.js');

// Add project
router.get('/create', function(req, res) {
  const project = req.query.projectName;
  const accessUser = req.query.accessUser;
  const accessKey = req.query.accessKey;
  const jiraLink = req.query.jiraLink;
  const gitLink = req.query.gitLink;
  const confluenceLink = req.query.confluenceLink;
  const user = req.user.UID;

  pool.request()
  .input('ProjectName', project)
  .input('AccessUser', accessUser)
  .input('AccessKey', accessKey)
  .input('Jira', jiraLink)
  .input('Git', gitLink)
  .input('Conf', confluenceLink)
  .input('User', user)
  .execute('CreateProject')
  .then((data) => {
    console.log("Project created: " + data);
    res.send({ result: "Project successfully created for user " + req.user.userName});
  })
  .catch((error) => {
    console.log("Failed project creation: " + error);
    res.status(500).json({ error: "An error occurred when creating the project"});
  });

});

// Remove a project
router.get('/remove', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;

  get_project_access(user, project)
  .then(() => {
    pool.request()
    .input('ProjectName', project)
    .input('User', user)
    .execute('RemoveProject')
    .then(() => {
      res.send({ result: "Project successfully removed" });
    })
    .catch((error) => {
      console.log("Failed project deletion: " + error);
      res.status(500).json({ error: "An error occurred when removing the project"});
    });
  })
  .catch(() => {
    res.status(404).json({ error: "User does not have write access to project, or project doesn't exist" });
  });

});

// Change project details
router.get('/change', function(req, res) {
  const project = req.query.projectName;
  const new_name = req.query.newName;
  const new_jira = req.query.jiraLink;
  const new_git = req.query.gitLink;
  const new_confluence = req.query.confluenceLink;
  const user = req.user.UID;

  get_project_access(user, project)
  .then(() => {

  })
  .catch(() => {
    res.status(404).json({ error: "User does not have access to project, or project does not exist"})
  });

});

// Get all details about all boards in project?
router.get('/summary', function(req, res) {

});

// Info of Project
router.get('/info', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;
 
  const query = `
    SELECT p.jira_link, p.git_link, p.confluence_link
    FROM project p
    JOIN user_project up ON p.project_id = up.project_id
    JOIN [user] u ON up.user_id = u.user_id
    WHERE p.project_name = @Project
    AND u.UID = @User
  `;

  pool.request()
  .input('Project', project)
  .input('User', user)
  .query(query)
  .then((result) => {
    if (result.recordset.length > 0) {
      res.send({ 
        projectName : project,
        jira: result.recordset[0].jira_link,
        git: result.recordset[0].git_link,
        confluence: result.recordset[0].confluence_link
      });
    }
    else {
      res.status(404).json({ error: "Project not found for user"});
    }
  })
  .catch((error) => {
    console.log("Issue with fetching user projects: " + error);
    res.status(500).json({ error: "An error occurred while processing your request"});
  });

});

// Projects that user is part of 
router.get('/projects', function(req, res) {
  const user = req.user.UID;

  const query = `
    SELECT p.project_name
    FROM project p
    JOIN user_project up ON p.project_id = up.project_id
    JOIN [user] u ON up.user_id = u.user_id 
    WHERE u.uid = @UID
  `;

  pool.request()
  .input('UID', user)
  .query(query)
  .then((result) => {
    const projectNames = result.recordset.map(record => record.project_name);
    console.log(`User ${req.user.userName} has access to: ${result.recordset}`);
    res.send({ projects: projectNames});
  })
  .catch((error) => {
    console.log("Could not access user projects: " + error);
    res.status(500).json({ error: "An error occurred while processing your request"});
  });

});


module.exports = router;
