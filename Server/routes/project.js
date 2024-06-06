var express = require('express');
var router = express.Router();

const { pool } = require('../db');
const { get_project_access, get_admin_access } = require('../Utils/AccessControl.js');
const { pull_jira_data_all, extract_issue_count, extract_users } = require('../Utils/Jira.js');

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
  .then(() => {
    res.send({ result: "Project successfully created for user " + req.user.userName});
  })
  .catch((error) => {
    if (error.number === 51000) {
      res.status(400).json({ error: "Project with given name already exists" });
    } 
    else {
      res.status(500).json({ error: "An error occurred when creating the project", data: error});
    }
  });
});

// Remove a project
router.get('/remove', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;

  get_admin_access(user, project)
  .then(() => {
    pool.request()
    .input('ProjectName', project)
    .input('User', user)
    .execute('RemoveProject')
    .then(() => {
      res.send({ result: "Project successfully removed" });
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred when removing the project", data: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });

});

// Change project details
router.get('/change', function(req, res) {
  const project = req.query.projectName;
  const new_abbreviation = req.query.abbreviation;
  const new_description = req.query.description;
  const new_confluence = req.query.confluenceLink;
  const new_git = req.query.gitLink;
  const user = req.user.UID;

  const validations = [
    validateParameterLength(new_abbreviation, 8, "Project Abbreviation"),
    validateParameterLength(new_description, 2048, "Project Description"),
    validateParameterLength(new_confluence, 255, "Confluence Link"),
    validateParameterLength(new_git, 255, "Git Link")
  ];

  const errors = validations.filter(validation => validation !== null);

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }
  
  get_admin_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `
      UPDATE [project]
      SET project_abbreviation = @Abbreviation,
      project_description = @Description,
      git_link = @Git,
      confluence_link = @Confluence
      WHERE project_id = @ID
    `;

    pool.request()
    .input('Abbreviation', new_abbreviation)
    .input('Description', new_description)
    .input('Git', new_git)
    .input('Confluence', new_confluence)
    .input('ID', projectID)
    .query(query)
    .then(() => {
      res.send({ result: "Project information successfully changed!" });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing your request', specific: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });

});

router.get('/admin', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;

  get_admin_access(user, project)
  .then(() => {
    res.send({ isAdmin: true });
  })
  .catch(() => {
    res.send({ isAdmin: false });
  });
  
});

// Get a list of all users in a project
router.get('/users', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;

  get_project_access(user, project)
  .then(() => {
    
    const query = `
      SELECT u.username, u.user_id
      FROM [user] u
      JOIN user_project up ON u.user_id = up.user_id
      JOIN project p ON up.project_id = p.project_id
      WHERE p.project_name = @Project
    `;

    pool.request()
    .input('Project', project)
    .query(query)
    .then((result) => {
      const users = result.recordset.map((user) => { return { label: user.username, id: user.user_id }; });

      res.send(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing your request', specific: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
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
      res.status(500).json({ error: 'An error occurred while processing your request', specific: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

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
      let users = extract_users(data);

      console.log("summary data:", issues);
      res.send({ 
        summary: issues,
        users: users 
      });
    }).catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing your request', specific: error});
    });

  })
  .catch((error) => {
    res.status(403).json({ error: error});
  });
});

// Info of Project
router.get('/info', function(req, res) {
  const project = req.query.projectName;
  const user = req.user.UID;
 
  get_project_access(user, project)
  .then(() => {
    const query = `
      SELECT p.jira_link, p.git_link, p.confluence_link, p.project_description, p.project_abbreviation
      FROM project p
      JOIN user_project up ON p.[project_id] = up.[project_id]
      JOIN [user] u ON up.[user_id] = u.[user_id]
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
      res.status(500).json({ error: "An error occurred while processing your request", specific: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

// Projects that user is part of 
router.get('/projects', function(req, res) {
  const user = req.user.UID;

  const query = `
    SELECT p.project_name, p.project_description, p.project_abbreviation
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

    res.send({ projectDetails });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

function validateParameterLength(parameter, maxLength, paramName) {
  if (parameter != undefined && parameter.length > maxLength) {
    return { error: `${paramName} too long` };
  }
  return null;
}

module.exports = router;
