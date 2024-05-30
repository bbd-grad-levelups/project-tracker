const sql = require('mssql');

const config = {
  server: process.env.projecttracker_db_endpoint,
  database: 'ProjectTrackerDB',
  user: process.env.projecttracker_db_user,
  password: process.env.projecttracker_db_password,
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);

pool.connect()
  .then(() => {
    console.log('Connected to Microsoft SQL Server database');
  })
  .catch(err => {
    console.error('Error connecting to Microsoft SQL Server database:', err);
  });

module.exports = { pool };
