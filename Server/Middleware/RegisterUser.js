const { pool } = require('../db');
const sql = require('mssql');

async function userRegistration(req, res, next) {

  if (req.user.UID != undefined) {
    const userUID = req.user.UID.toString();
    const userName = req.user.userName;
    const query = `SELECT * FROM [user] u WHERE uid = @UID`;

    pool.request()
    .input('UID', userUID)
    .query(query)
    .then(async (result) => {
      if (result.recordset.length === 0) {
        console.log(`Adding user: ${userName} ${userUID}`);
        await addUser(userName, userUID);
      }

      next();
    })
    .catch((error) => {
      console.log(`User request failed: ${error}`);
      res.status(500).json({ error: "An error occurred during user authentication"})
    })
  }
  else {
    res.status(403).json({ error: "Unauthorized access"});
  }
}

async function addUser(userName, UID) {
  const query = `INSERT INTO [user] (username, uid, email) VALUES (@username, @uid, 'none@nowhere.com')`;

  await pool.request()
  .input('username', sql.VarChar, userName)
  .input('uid', sql.VarChar, UID)
  .query(query)
  .then((insertResult) => {
    console.log('New user created:', insertResult);
  })
  .catch((err) => {
    console.log("Could not register user: " + err);
  });
}

module.exports = userRegistration;
