// Importing npm packages
const inquirer = require("inquirer"); // Import and require inquirer
const mysql = require("mysql2"); // Import and require mysql2
const process = require("process");
require("dotenv").config(); // Import and require/configure dotenv

// Note that I installed console.table as an npm package, but it turns out I don't need it because console.table works by itself without the package

// Tried to connect multiple js files by exporting/requiring, but it was happier all in one file for now
// const queries = require("./queries");
// const mainMenuQuestion = require("./index");
// const app = require("../app");

// dotenv variables to mask sensitive info
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let dbName = process.env.DB_NAME;

// Connect to database & use dotenv
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

// -------------------- BEGIN QUESTIONS --------------------
// Main question that directs user to all other questions depending on what they choose to do
function mainMenuQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Main Menu: What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
        name: "mainMenu",
      },
    ])
    .then((answer) => {
      // Determines which function to call next depending on the user's choice from the above choices list
      if (answer.mainMenu === "View all departments") {
        // Calls this function, which is a console.table function to print sql table in terminal of all departments
        viewAllDepartments();
      } else if (answer.mainMenu === "View all roles") {
        // Calls this function, which is a console.table function to print sql table of all roles
        viewAllRoles();
      } else if (answer.mainMenu === "View all employees") {
        // Calls this function, which is a console.table function to print sql table of all employees
        viewAllEmployees();
      } else if (answer.mainMenu === "Add a department") {
        // Calls this function, which asks for the new department details
        addDepartmentQuestion();
      } else if (answer.mainMenu === "Add a role") {
        // Calls this function, which asks for the new role details
        addRoleQuestion();
      } else if (answer.mainMenu === "Add an employee") {
        // Calls this function, which asks for the new employee details
        addEmployeeQuestion();
      } else if (answer.mainMenu === "Update an employee role") {
        // Calls this function, which asks for the updated employee details
        updateEmployeeRoleQuestion();
      } else {
        // Otherwise, exit!
        console.log("All done!");
        process.exit();
      }
    })

    // Catch any errors that occur
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log("Success! (but something is missing)", error);
      }
    });
}

// Another inquirer function to gather new department details
function addDepartmentQuestion() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter department name",
        name: "departmentName",
      },
    ])
    // Grabs the new department name based on the user input and then passes it to the addDepartmentData() function below
    .then((answer) => {
      addDepartmentData(answer.departmentName);
    })
    // Catch any errors that occur
    .catch((err) => console.log(err));
}

// Another inquirer function to gather new role details
function addRoleQuestion() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the name of the role",
        name: "roleName",
      },
      {
        type: "input",
        message: "Enter the salary for the role",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department does this role belong to?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service"],
        name: "roleDepartment",
      },
    ])

    // This .then does the same as the addDepartmentQuestion() above, where it grabs the new role name, salary and department based on the user input and then passes it to the addRoleData() function below
    // However, there is an extra step: the department name the user chose from the list of options has to be translated to the numerical department_id for sql to understand it
    .then((answer) => {
      // Placeholder variable that gets reassigned later
      let temporaryDeptRoleId = null;
      // translate answer.roleDepartment from string to corresponding dept id
      // query db with a WHERE clause that includes what dept name corresponds to which dept id
      // SELECT * FROM business_db.department WHERE name = "answer.roleDepartment";
      // resulting table has id that corresponds with department user chose

      db.promise()
        .query(
          // Could do SELECT * FROM... but id is slightly more specific/readable to what we are targeting because we just want 1 number that corresponds to that department
          `SELECT id FROM business_db.department WHERE name = "${answer.roleDepartment}"`
        )
        // Another .then is needed because there is a database query within an inquirer .prompt. Only when we have the new role's translated department_id, then we can pass that info to the addRoleData() function
        .then(([rows, fields]) => {
          // Accessing just the department_id (just a number) with object bracket and dot notation
          temporaryDeptRoleId = rows[0].id;
          // Passes user input to the addRoleData() function
          addRoleData(answer.roleName, answer.roleSalary, temporaryDeptRoleId);
        })
        // Catch any errors that occur within the database query
        .catch((err) => console.log(err));
    })

    // Catch any errors that occur within the inquirer .prompt
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log("Success! (but something is missing)", error);
      }
    });
}

// Another inquirer function to gather new employee details
function addEmployeeQuestion() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "employeeFirstName",
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "employeeLastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
          "Customer Service",
          "HR Representative",
        ],
        name: "employeeRole",
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        choices: [
          "Mike Chan",
          "Kevin Tupik",
          "Malia Brown",
          "Tom Allen",
          "Jason Frello",
          "None",
        ],
        name: "employeeManager",
      },
    ])

    // This .then does the same as the addDepartmentQuestion() above, where it grabs the new employee first name, last name, role and manager based on the user input and then passes it to the addEmployeeData() function below
    // However, there are two extra steps:
    // 1) The role and manager name the user chose from the list of options have to be translated for sql to understand it.
    // 2) The role has to be translated to a numerical role_id and the manager has to be split into first_name and last_name categories based on the employee table data
    .then((answer) => {
      // Placeholder variables that get reassigned later
      let temporaryEmployeeRoleId = null;
      let temporaryManagerId = null;
      // A database query to find the id associated with the role the new employee has
      db.promise()
        .query(
          // Could do SELECT * FROM... but id is slightly more specific/readable to what we are targeting because we just want 1 number that corresponds to that role title
          `SELECT id FROM business_db.role WHERE title = "${answer.employeeRole}"`
        )
        // Another .then is needed because there is a database query within an inquirer .prompt. Once we have the new employee's translated role_id, then we can pass that info to the addEmployeeData() function later
        .then(([rows]) => {
          // Accessing just the role_id (just a number) with object bracket and dot notation
          temporaryEmployeeRoleId = rows[0].id;
        })
        // Catch any errors that occur within the database query
        .catch((err) => console.log(err));
      // Another database query to find the manager_id associated with the manager the new employee has
      db.promise()
        .query(
          // Retrieving the manager_id if the new employee has a manager
          // Have to use the .split() string method to first separate the manager's first and last name for sql to understand it
          `SELECT manager_id FROM business_db.employee WHERE first_name = "${
            answer.employeeManager.split(" ")[0]
          }" AND last_name = "${answer.employeeManager.split(" ")[1]}";`
        )
        // Yet another .then for this database query. Once we have the new employee's translated manager_id, then we can pass that info to the addEmployeeData() function later
        .then(([rows, fields]) => {
          // Accessing just the manager_id (just a number) with object bracket and dot notation
          temporaryManagerId = rows[0].manager_id;
        })
        // And finally, we can give the addEmployeeData() function all of this info
        .then(() => {
          addEmployeeData(
            answer.employeeFirstName,
            answer.employeeLastName,
            temporaryEmployeeRoleId,
            temporaryManagerId
          );
        })
        // Catch any errors that occur within the database query
        .catch((err) => console.log(err));
    })

    // Catch any errors that occur within the inquirer .prompt
    .catch((err) => console.log(err));
}

function updateEmployeeRoleQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee do you want to update?",
        choices: [
          "John Doe",
          "Mike Chan",
          "Ashley Rodriguez",
          "Kevin Tupik",
          "Kunal Singh",
          "Malia Brown",
          "Sarah Lourd",
          "Tom Allen",
          "Jason Frello",
          "None",
        ],
        name: "updateEmployeeName",
      },
      {
        type: "list",
        message: "Which role does the selected employee now have?",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
          "Customer Service",
          "HR Representative",
        ],
        name: "updateEmployeeRole",
      },
    ])

    // find id of employee to update
    // find id of role to update
    // store both 1 & 2 in temporary variables to pass to updateEmployeeRoleData() function
    .then((answer) => {
      // Placeholder variables that get reassigned later
      let temporaryUpdateEmployeeId = null;
      let temporaryUpdateEmployeeRoleId = null;

      // A database query to find the id associated with the employee that needs an update
      db.promise()
        .query(
          // Could do SELECT * FROM... but id is slightly more specific/readable to what we are targeting because we just want 1 number that corresponds to that employee
          // Have to use the .split() string method to first separate the employee's first and last name for sql to understand it
          `SELECT id FROM business_db.employee WHERE first_name = "${
            answer.updateEmployeeName.split(" ")[0]
          }" AND last_name = "${answer.updateEmployeeName.split(" ")[1]}";`
        )
        // Another .then is needed because there is a database query within an inquirer .prompt. Once we have the new employee's id given the name the user chose, then we can pass that info to the updateEmployeeRoleData() function later
        .then((rows) => {
          // console.log("rowsEmployeeId", rows);
          // Accessing just the employee's id (just a number) with object bracket and dot notation
          temporaryUpdateEmployeeId = rows[0][0].id;
          // console.log("temporaryUpdateEmployeeId", temporaryUpdateEmployeeId);
        })
        // Catch any errors that occur within the database query
        .catch((err) => console.log(err));

      // Another database query to find the role_id associated with the new role the employee has
      db.promise()
        .query(
          // Could do SELECT * FROM... but id is slightly more specific/readable to what we are targeting because we just want 1 number that corresponds to that employee's new role
          `SELECT id FROM role
              WHERE title = "${answer.updateEmployeeRole}";`
        )
        // Yet another .then for this database query. Once we have the new employee's translated role_id, then we can pass that info to the updateEmployeeRoleData() function later
        .then(([rows, fields]) => {
          // console.log("rowsEmployeeRoleId", rows);
          // Accessing just the role_id (just a number) with object bracket and dot notation
          temporaryUpdateEmployeeRoleId = rows[0].id;
          // console.log(
          //   "temporaryUpdateEmployeeRoleId",
          //   temporaryUpdateEmployeeRoleId
          // );
        })
        // And finally, we can give the updateEmployeeRoleData() function this info
        .then(() => {
          updateEmployeeRoleData(
            temporaryUpdateEmployeeId,
            temporaryUpdateEmployeeRoleId
          );
        })
        // Catch any errors that occur within the database query
        .catch((err) => console.log(err));
    })

    // Catch any errors that occur within the inquirer .prompt
    .catch((err) => console.log(err));
}
// -------------------- END QUESTIONS --------------------

// Query database

// -------------------- VIEW DATA ONLY --------------------
// console.table function to print sql table in terminal of all departments
function viewAllDepartments() {
  // In order for the printed sql table to not get squished/overridden by the main menu question, a promise is used
  db.promise()
    // Query the database called business_db to request its data so that we can see it/print to console; specifically asking for the department table data
    .query("SELECT * FROM business_db.department;")
    // After the query, we then print to the console with console.table
    .then(([rows, fields]) => {
      console.table(rows);
    })
    // And catch any errors that occur
    .catch((err) => console.log(err))
    // Then back to the main menu
    .then(() => mainMenuQuestion());
}

// console.table function to print sql table in terminal of all roles
function viewAllRoles() {
  // In order for the printed sql table to not get squished/overridden by the main menu question, a promise is used
  db.promise()
    // Query the database called business_db to request its data so that we can see it/print to console; specifically asking for the role table data
    .query("SELECT * FROM business_db.role;")
    // After the query, we then print to the console with console.table
    .then(([rows, fields]) => {
      console.table(rows);
    })
    // And catch any errors that occur
    .catch((err) => console.log(err))
    // Then back to the main menu
    .then(() => mainMenuQuestion());
}

// console.table function to print sql table in terminal of all employees
function viewAllEmployees() {
  // In order for the printed sql table to not get squished/overridden by the main menu question, a promise is used
  db.promise()
    // Query the database called business_db to request its data so that we can see it/print to console; specifically asking for the employee table data
    .query("SELECT * FROM business_db.employee;")
    // After the query, we then print to the console with console.table
    .then(([rows, fields]) => {
      console.table(rows);
    })
    // And catch any errors that occur
    .catch((err) => console.log(err))
    // Then back to the main menu
    .then(() => mainMenuQuestion());
}
// -------------------- END VIEW DATA --------------------

// -------------------- ADD DATA ONLY --------------------
// Only giving this function one parameter because there is only one answer the user would have given
function addDepartmentData(answer) {
  db.promise()
    // Query the database to insert data into the business_db database. Specifically, inserting data into the name column and dynamically adding the user's typed new department name
    .query(`INSERT INTO department (name) VALUES ("${answer}");`)
    .then(() => {
      // After the query, a confirmation message is printed to the console
      console.log(`Added ${answer} to the database`);
      // Then the viewAllDepartments() function is called again to view the department list with the new addition
      viewAllDepartments();
    })
    // Catch any errors that occur
    .catch((err) => console.log(err));
}

// Giving this function three parameters because there are three answers we need from the user
function addRoleData(roleName, roleSalary, roleDepartmentId) {
  db.promise()
    // Query the database to insert data into the business_db database. Specifically, inserting data into the title, salary and department_id columns and dynamically adding the user's typed new role info
    .query(
      `INSERT INTO role (title, salary, department_id) VALUES ("${roleName}", "${roleSalary}", "${roleDepartmentId}");`
    )
    .then((response) => {
      // After the query, a confirmation message is printed to the console
      console.log(`Added ${roleName} to the database`);
      // Then the viewAllRoles() function is called again to view the role list with the new addition
      viewAllRoles();
    })
    // Catch any errors that occur
    .catch((err) => console.log(err));
}

// Giving this function four parameters because there are four answers we need from the user
function addEmployeeData(
  employeeFirstName,
  employeeLastName,
  employeeRoleId,
  employeeManagerId
) {
  db.promise()
    // Query the database to insert data into the business_db database. Specifically, inserting data into the first_name, last_name, role_id, and manager_id columns and dynamically adding the user's typed new role info
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeFirstName}", "${employeeLastName}", "${employeeRoleId}", "${employeeManagerId}");`
    )
    .then(() => {
      // After the query, a confirmation message is printed to the console
      console.log(
        `Added ${(employeeFirstName, employeeLastName)} to the database`
      );
      // Then the viewAllEmployees() function is called again to view the role list with the new addition
      viewAllEmployees();
    })
    // Catch any errors that occur
    .catch((err) => console.log(err));
}
// -------------------- END ADD DATA --------------------

// -------------------- UPDATE DATA ONLY --------------------
// Giving this function two parameters because there are two answers we need from the user
function updateEmployeeRoleData(updateEmployeeId, updateEmployeeRoleId) {
  db.promise()
    // console
    //   .log(
    //     "updateEmployeeId",
    //     updateEmployeeId,
    //     "updateEmployeeRoleId",
    //     updateEmployeeRoleId
    //   )
    // Query the database to insert data into the business_db database. Specifically, inserting data into the role_id columns and dynamically adding the user's new role info
    .query(
      `UPDATE employee
    SET role_id = ${updateEmployeeRoleId}
    WHERE id = ${updateEmployeeId};`
    )
    .then(() => {
      // After the query, a confirmation message is printed to the console
      console.log(`Updated employee's role`);
      // Then the viewAllEmployees() function is called again to view the role list with the new update
      viewAllEmployees();
    })
    // Catch any errors that occur
    .catch((err) => console.log(err));
}
// -------------------- END UPDATE DATA --------------------

// Start the app
mainMenuQuestion();

// As noted above, I tried to connect multiple js files by exporting/requiring, but it was happier all in one file
// module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees };

// module.exports = mainMenuQuestion;
