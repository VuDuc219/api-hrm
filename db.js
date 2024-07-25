const mysql = require('mysql2');

// Create the connection to the database
const connection = mysql.createConnection({
  host: 'https://ghf55-22111.azdigihost.com:2083', // Your database host
  user: 'xfnwdpvw_payment',      // Your database user
  password: 'Optisix1@', // Your database password
  database: 'xfnwdpvw_payment' // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
