require("dotenv").config();
console.log(process.env);

let dbName = process.env.DB_NAME;
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;