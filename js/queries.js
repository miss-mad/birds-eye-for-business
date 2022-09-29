require("dotenv").config();
const mysql = require("mysql2"); // Import and require mysql2
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let dbName = process.env.DB_NAME;

// Connect to database
const db = mysql.createConnection(
  {
    // my computer
    host: "localhost",
    // MySQL username stored in an environmental variable
    user: dbUser, // or process.env.DB_USER
    // MySQL password stored in an environmental variable
    password: dbPassword, // or process.env.DB_PASSWORD
    database: dbName, // or process.env.DB_NAME
  },
  console.log(`Connected to the business_db database.`)
);


// Query database
function viewAllDepartments() {
  db.query("SELECT * FROM business_db.department;", function (err, results) {
    console.table(results);
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM business_db.role;", function (err, results) {
    console.table(results);
  });
}

function viewAllEmployees() {
  db.query("SELECT * FROM business_db.employee;", function (err, results) {
    console.table(results);
  });
}
module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees };
