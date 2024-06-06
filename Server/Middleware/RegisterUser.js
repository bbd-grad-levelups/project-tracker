const { pool } = require('../db');
const sql = require('mssql');

async function userRegistration(req, res, next) {

  if (req.user.UID != undefined) {
    const userUID = req.user.UID.toString();
    const userName = req.user.userName;
    const email = req.user.email;
    const query = `SELECT * FROM [user] u WHERE uid = @UID`;

    pool.request()
    .input('UID', userUID)
    .query(query)
    .then(async (result) => {
      if (result.recordset.length === 0) {
        await addUser(userName, userUID, email);
      }

      next();
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred during user authentication"})
    })
  }
  else {
    res.status(403).json({ error: "Unauthorized access"});
  }
}

async function addUser(userName, UID, email) {
  const query = `INSERT INTO [user] (username, uid, email) VALUES (@username, @uid, @email)`;

  await pool.request()
  .input('username', userName)
  .input('uid', UID)
  .input('email', email)
  .query(query);
}

module.exports = userRegistration;
