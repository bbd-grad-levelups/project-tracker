const sql = require('mssql');

const config = {
  server: 'project-tracker-db.cex3uty77nu9.eu-west-1.rds.amazonaws.com',
  database: 'ProjectTrackerDB',
  user: 'dbadmin',
  password: 'M4T!#EJvk->tfiwSaSJ2)DLy[%~Z',
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
