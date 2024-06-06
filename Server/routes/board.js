const { pool } = require('../db');

var express = require('express');
var router = express.Router();

const { pull_jira_data, extract_issue_count, extract_users } = require('../Utils/Jira.js');
const { get_project_access, get_admin_access} = require('../Utils/AccessControl.js');

router.get('/summary', function(req, res) {
  const project = req.query.projectName;
  const board = req.query.boardName;
  const user = req.user.UID;
  // Test if user has access to this board

  get_project_access(user, project)
  .then((answer) => {
    const apiUser = answer.user;
    const apiToken = answer.token;
    const apiProject = answer.project;
    const apiBoard = answer.board;

    pull_jira_data(
      apiProject,
      board,
      apiUser,
      apiToken
    )
    .then((data) => {
      let issues = extract_issue_count(data);
      let users = extract_users(data);

      // Expand summary data for board here.
      console.log("summary data:", issues);
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


router.get('/create', function(req, res) {
  const project = req.query.projectName;
  const board = req.query.boardName;
  const boardKey = req.query.boardKey;
  const user = req.user.UID;

  if (board.length > 255) {
    res.status(400).json({ error: "Board name must be shorter than 250 characters"});
  }

  get_admin_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `INSERT INTO board (project_id, board_name, board_key) VALUES (@project, @board_name, @board_key)`;

    pool.request()
    .input('project', projectID)
    .input('board_name', board)
    .input('board_key', boardKey)
    .query(query)
    .then((result) => {
      res.json({ message: `Board ${board} has been successfully added to the project.`});
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing your request.', specific: error});
    });
  })
  .catch((error) => {
    res.status(403).json({ error: error });
  });
});

router.get('/remove', function(req, res) {
  const project = req.query.projectName;
  const board = req.query.boardName;
  const user = req.user.UID;

  get_admin_access(user, project)
  .then((answer) => {
    const projectID = answer.projectID;

    const query = `DELETE FROM board WHERE project_id = @project AND board_name = @board`;

    pool.request()
    .input('project', projectID)
    .input('board', board)
    .query(query)
    .then((result) => {
      res.json({ message: `Board ${board} has been successfully removed from the project.`});
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
