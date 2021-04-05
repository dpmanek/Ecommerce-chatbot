const mysql = require('mysql');

// const connection      =    mysql.createPool({
//     connectionLimit : 100,
//     waitForConnections : true,
//     queueLimit :0,
//     host     : '127.0.0.1',
//     user     : 'root',
//     password : '',
//     database : 'ecommercebot',
//     debug    :  true,
//     wait_timeout : 28800,
//     connect_timeout :10
// }); 

const connection = mysql.createConnection({
  host: "localhost",  
  user: "root",
  password: "root",
  database : 'ecommercebot',
  insecureAuth : true

});







module.exports = {
    connection
}