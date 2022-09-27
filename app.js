require("dotenv").config();
const mysql = require("mysql2"); // Import and require mysql2
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let dbName = process.env.DB_NAME;
const start = require("./js");

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

// Start App Here
start();
