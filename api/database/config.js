var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  database : 'campos_gaia_2',
  user     : 'root',
  password : ''
});

connection.connect();
/* 
connection.query('SELECT * FROM deparments', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows);
});
 */

module.exports = connection;