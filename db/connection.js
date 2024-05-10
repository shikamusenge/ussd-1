const mysql = require("mysql2");
const connn = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "users",
  })
  .promise();
// connn.connect((e) => {
//   if (e) throw e;
// });
module.exports = connn;
