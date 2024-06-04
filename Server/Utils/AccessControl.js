const { pool } = require('../db');
const sql = require('mssql');

// This returns the api token and user related to the project if this user has access, otherwise it rejects.
async function get_board_access(uid, project, boardName) {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT p.jira_link, p.access_user, p.access_key, b.board_key
      FROM board b
      JOIN project p ON b.project_id = p.project_id
      JOIN user_project up ON p.project_id = up.project_id
      JOIN [user] u ON up.user_id = u.user_id
      WHERE p.project_name = @project
      AND u.uid = @uid
      AND b.board_name = @boardName
    `;


    pool.request()
      .input('project', project)
      .input('uid', uid)
      .input('boardName', boardName)
      .query(query)
      .then((result) => {
        if (result.recordset.length > 0) {
          resolve({
            user: result.recordset[0].access_user,
            token: result.recordset[0].access_key,
            project: result.recordset[0].jira_link,
            board: result.recordset[0].board_key
          });
        }
        else {
          reject("User does not have access to board, or board does not exist.");
        }

      })
      .catch((error) => {
        console.log("Database call error: " + error);
        reject();
      });

  });
}

async function get_project_access(uid, project) {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT p.project_id, p.jira_link, p.access_user, p.access_key
      FROM project p
      JOIN user_project up ON p.project_id = up.project_id
      JOIN [user] u ON up.user_id = u.user_id
      JOIN role r ON r.role_id = up.role_id
      WHERE p.project_name = @project
      AND u.uid = @uid
    `;

    pool.request()
      .input('project', project)
      .input('uid', uid)
      .query(query)
      .then((result) => {
        if (result.recordset.length > 0) {
          resolve({
            projectID: result.recordset[0].project_id,
            user: result.recordset[0].access_user,
            token: result.recordset[0].access_key,
            project: result.recordset[0].jira_link
          });
        }
        else {
          reject("User does not have access to project, or project does not exist");
        }

      })
      .catch((error) => {
        console.log("Database call error: " + error);
        reject();
      });
  });
}


async function get_admin_access(uid, project) {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT p.project_id, p.jira_link, p.access_user, p.access_key
      FROM project p
      JOIN user_project up ON p.project_id = up.project_id
      JOIN [user] u ON up.user_id = u.user_id
      JOIN role r ON r.role_id = up.role_id
      WHERE p.project_name = @project
      AND r.description = 'Owner'
      AND u.uid = @uid
    `;

    pool.request()
      .input('project', project)
      .input('uid', uid)
      .query(query)
      .then((result) => {
        if (result.recordset.length > 0) {
          resolve({
            projectID: result.recordset[0].project_id,
            user: result.recordset[0].access_user,
            token: result.recordset[0].access_key,
            project: result.recordset[0].jira_link
          });
        }
        else {
          reject("User does not own project, or project does not exist");
        }

      })
      .catch((error) => {
        console.log("Database call error: " + error);
        reject();
      });
  });
}

module.exports = { get_board_access, get_project_access, get_admin_access };