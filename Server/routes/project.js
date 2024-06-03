var express = require('express');
var router = express.Router();

const { pool } = require('../db');
const { get_project_access } = require('../Utils/AccessControl.js');
const { pull_jira_data_all, extract_issue_count } = require('../Utils/Jira.js');

// Add project
router.get('/create', function(req, res) {
  const project = req.query.projectName;
  const accessUser = req.query.accessUser;
  const accessKey = req.query.accessKey;
  const description = req.query.projectDescription;
  const abbreviation = req.query.projectAbbreviation;
  const jiraLink = req.query.jiraLink;
  const gitLink = req.query.gitLink;
  const confluenceLink = req.query.confluenceLink;
  const user = req.user.UID;

  const validations = [
    validateParameterLength(project, 255, "Project Name"),
    validateParameterLength(accessUser, 255, "Access User"),
    validateParameterLength(accessKey, 255, "Access Key"),
    validateParameterLength(description, 2048, "Project Description"),
    validateParameterLength(abbreviation, 8, "Project Abbreviation"),
    validateParameterLength(jiraLink, 255, "JIRA Link"),
    validateParameterLength(gitLink, 255, "Git Link"),
    validateParameterLength(confluenceLink, 255, "Confluence Link")
  ];

  const errors = validations.filter(validation => validation !== null);

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  pool.request()
  .input('ProjectName', project)
  .input('AccessUser', accessUser)
  .input('AccessKey', accessKey)
  .input('Description', description)
  .input('Abbrev', abbreviation)
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
    if (error.number === 51000) {
      res.status(400).json({ error: "Project with given name already exists" });
    } 
    else {
      res.status(500).json({ error: "An error occurred when creating the project"});

    }
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
  const new_description = req.query.description;
  const new_abbreviation = req.query.abbreviation;
  const new_jira = req.query.jiraLink;
  const new_git = req.query.gitLink;
  const new_confluence = req.query.confluenceLink;
  const user = req.user.UID;

  const validations = [
    validateParameterLength(new_name, 255, "Project Name"),
    validateParameterLength(new_description, 2048, "Project Description"),
    validateParameterLength(new_abbreviation, 8, "Project Abbreviation"),
    validateParameterLength(new_jira, 255, "JIRA Link"),
    validateParameterLength(new_git, 255, "Git Link"),
    validateParameterLength(new_confluence, 255, "Confluence Link")
  ];

  const errors = validations.filter(validation => validation !== null);

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }
  
  get_project_access(user, project)
  .then(() => {
    res.send({ error: "Unimplemented, sorry haha"});
  })
  .catch(() => {
    res.status(404).json({ error: "User does not have access to project, or project does not exist"})
  });

});

// Get a list of all boards in a project.
router.get('/boards', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;
  
  get_project_access(user, project)
  .then(() => {
    
    const query = `
      SELECT b.board_name
      FROM board b
      JOIN project p ON b.project_id = p.project_id 
      WHERE p.project_name = @Project
    `;

    pool.request()
    .input('Project', project)
    .query(query)
    .then((result) => {
      const boards = result.recordset;

      res.send({boards: boards});
    })
    .catch((error) => {
      console.log("Error: ", error);
      res.status(500).json({ error: 'An error occurred while processing your request'});
    });
  })
  .catch((error) => {
    console.log("error when getting boards: " + error);
    res.status(403).json({ error: 'User does not have access to project, or project does not exist'});
  });

})
// Get all details about all boards in project.
router.get('/summary', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;
  // Test if user has access to this board
  get_project_access(user, project)
  .then((answer) => {
    const apiUser = answer.user;
    const apiToken = answer.token;
    const apiProject = answer.project;

    pull_jira_data_all(
      apiProject,
      apiUser,
      apiToken
    ).then((data) => {
      let issues = extract_issue_count(data);
      // Expand summary data here.
      console.log("summary data:", issues);
      res.send({ 
        summary: issues 
      });
    }).catch((error) => {
      console.log("Error: ", error);
      res.status(500).json({ error: 'An error occurred while processing your request'});
    });

  })
  .catch((error) => {
    console.log("error when getting board: " + error);
    res.status(403).json({ error: error});
  });
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
        description: result.recordset[0].project_description,
        abbreviation: result.recordset[0].project_abbreviation,
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
    SELECT p.project_name, p.project_description
    FROM project p
    JOIN user_project up ON p.project_id = up.project_id
    JOIN [user] u ON up.user_id = u.user_id 
    WHERE u.uid = @UID
  `;

  pool.request()
  .input('UID', user)
  .query(query)
  .then((result) => {
    const projectDetails = result.recordset.map((record) =>  {
      return { 
        name: record.project_name,
        tag: record.project_abbreviation
      }
    });
    console.log(`User ${req.user.userName} has access to: ${result.recordset}`);
    res.send({ projects: projectDetails});
  })
  .catch((error) => {
    console.log("Could not access user projects: " + error);
    res.status(500).json({ error: "An error occurred while processing your request"});
  });

});

function validateParameterLength(parameter, maxLength, paramName) {
  if (parameter.length > maxLength) {
    return { error: `${paramName} too long` };
  }
  return null;
}

module.exports = router;
