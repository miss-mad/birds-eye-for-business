// importing npm packages
const inquirer = require("inquirer"); // Import and require inquirer
// const queries = require("./queries");
// console.log(queries);
const mysql = require("mysql2"); // Import and require mysql2
require("dotenv").config(); // Import and require/configure dotenv
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
      // determines which function to call next depending on the user's choice from the above list
      if (answer.mainMenu === "View all departments") {
        // console.table function to print sql table of all departments
        viewAllDepartments();
        // mainMenuQuestion();
      } else if (answer.mainMenu === "View all roles") {
        // console.table function to print sql table of all roles
        viewAllRoles();
      } else if (answer.mainMenu === "View all employees") {
        // console.table function to print sql table of all employees
        viewAllEmployees();
      } else if (answer.mainMenu === "Add a department") {
        addDepartmentQuestion();
        // console.table function to print sql table of all employees
      } else if (answer.mainMenu === "Add a role") {
        addRoleQuestion();
      } else if (answer.mainMenu === "Add an employee") {
        addEmployeeQuestion();
      } else if (answer.mainMenu === "Update an employee role") {
        updateEmployeeRoleQuestion();
      } else {
        // have a quit function? .exit()? or just return
        return console.log("bye!").exit();
      }
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log("Success! (but something is missing)", error);
      }
    });
}

function addDepartmentQuestion() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter department name",
        name: "departmentName",
      },
    ])

    .then((answer) => {
      addDepartmentData(answer.departmentName);
    })

    .catch((err) => console.log(err));
}

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
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service", "HR"],
        name: "roleDepartment",
      },
    ])

    .then((answer) => {
      let temporaryDeptRoleId = null;
      // translate answer.roleDepartment from string to corresponding dept id
      // query db with a WHERE clause that includes what dept name corresponds to which dept id
      // SELECT * FROM business_db.department WHERE name = "answer.roleDepartment";
      // resulting table has id that corresponds with department user chose

      db.promise()
        .query(
          // could do SELECT * FROM... but id is slightly more specific/readable to what I am targeting
          `SELECT id FROM business_db.department WHERE name = "${answer.roleDepartment}"`
        )
        .then(([rows, fields]) => {
          temporaryDeptRoleId = rows[0].id;
          // console.log(temporaryDeptRoleId);
          addRoleData(answer.roleName, answer.roleSalary, temporaryDeptRoleId);
        })
        .catch((err) => console.log(err));
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log("Success! (but something is missing)", error);
      }
    });
}

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
        name: "employeeManager",
      },
    ])

    .then((answer) => {
      let temporaryEmployeeRoleId = null;
      let temporaryManagerId = null;
      // translate answer.roleDepartment from string to corresponding dept id
      // query db with a WHERE clause that includes what dept name corresponds to which dept id
      // SELECT * FROM business_db.department WHERE name = "answer.roleDepartment";
      // resulting table has id that corresponds with department user chose

      db.promise()
        .query(
          // could do SELECT * FROM... but id is slightly more specific/readable to what I am targeting
          `SELECT id FROM business_db.role WHERE title = "${answer.employeeRole}"`
        )
        .query(
          `SELECT id FROM business_db.employee WHERE first_name = "${answer.employeeFirstName}" AND last_name = "${answer.employeeLastName}";`
        )
        .then(([rows, fields]) => {
          temporaryEmployeeRoleId = rows[0].id;
          temporaryManagerId = rows[0].id;
          console.log(temporaryEmployeeRoleId);
          console.log(temporaryManagerId);
          addEmployeeData(
            answer.employeeFirstName,
            answer.employeeLastName,
            temporaryEmployeeRoleId,
            temporaryManagerId
          );
        })
        .catch((err) => console.log(err));
    })

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
        name: "updateEmployeeName",
      },
    ])

    .then((answer) => {
      // print message "Updated employee's role"
      console.log(`Updated ${answer.updateEmployeeName}'s role`);
      // updateEmployeeRoleData(answer.updateEmployeeName);
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log("Success! (but something is missing)", error);
      }
    });
}
// -------------------- END QUESTIONS --------------------

// Query database

// -------------------- VIEW DATA ONLY --------------------
function viewAllDepartments() {
  db.promise()
    .query("SELECT * FROM business_db.department;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => console.log(err))
    .then(() => mainMenuQuestion());
}

function viewAllRoles() {
  db.promise()
    .query("SELECT * FROM business_db.role;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => console.log(err))
    .then(() => mainMenuQuestion());
}

function viewAllEmployees() {
  db.promise()
    .query("SELECT * FROM business_db.employee;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => console.log(err))
    .then(() => mainMenuQuestion());
}
// -------------------- END VIEW DATA --------------------

// -------------------- ADD DATA ONLY --------------------
function addDepartmentData(answer) {
  db.promise()
    .query(`INSERT INTO department (name) VALUES ("${answer}");`)
    .then(() => {
      console.log(`Added ${answer.departmentName} to the database`);
      viewAllDepartments();
    })
    .catch((err) => console.log(err));
}

function addRoleData(roleName, roleSalary, roleDepartmentId) {
  console.log(roleDepartmentId);
  db.promise()
    .query(
      `INSERT INTO role (title, salary, department_id) VALUES ("${roleName}", "${roleSalary}", "${roleDepartmentId}");`
    )
    .then((response) => {
      // console.log(response);
      console.log(`Added ${roleName} to the database`);
      viewAllRoles();
    })
    .catch((err) => console.log(err));
}

function addEmployeeData(
  employeeFirstName,
  employeeLastName,
  employeeRole,
  employeeManager
) {
  db.promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeFirstName}", "${employeeLastName}", "${employeeRole}", "${employeeManager}");`
    )
    .then(() => {
      viewAllEmployees();
      console.log(
        `Added ${
          (answer.employeeFirstName, answer.employeeLastName)
        } to the database`
      );
    })
    .catch((err) => console.log(err));
}
// -------------------- END ADD DATA --------------------

// -------------------- UPDATE DATA ONLY --------------------
function updateEmployeeRoleData(answer) {
  db.promise()
    .query(`INSERT INTO employee (name) VALUES ("${answer}");`)
    .then(viewAllEmployees())
    .catch((err) => console.log(err));
}
// -------------------- END UPDATE DATA --------------------

mainMenuQuestion();
// module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees };

// module.exports = mainMenuQuestion;
