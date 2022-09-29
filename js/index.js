// "require" is a way to target a file or package needed to create this readme generator app
// in the first two cases, "require" allows us to use certain packages within this js file
const inquirer = require("inquirer");
const queries = require("./queries");
// in this case, information from another js file is imported so that we can use it in this one
// const generateJSON = require("");
console.log(queries);

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
        queries.viewAllDepartments();
      } else if (answer.mainMenu === "View all roles") {
        // console.table function to print sql table of all roles
        queries.viewAllRoles();
      } else if (answer.mainMenu === "View all employees") {
        // console.table function to print sql table of all employees
        queries.viewAllEmployees();
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
        // have a quit function? or just return
      }
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(
          "Success! (but no json file generated - something is probably missing from the generateJSON)",
          error
        );
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
      // print message "Added <department name> to the database"
      console.log("Added <department name> to the database");
      mainMenuQuestion();
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(
          "Success! (but no json file generated - something is probably missing from the generateJSON)",
          error
        );
      }
    });
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
      // print message "Added <role name> to the database"
      console.log("Added <role name> to the database");
      mainMenuQuestion();
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(
          "Success! (but no json file generated - something is probably missing from the generateJSON)",
          error
        );
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
        choices: ["", "", "", "", "", "", "", "", "", "", "None"],
        name: "employeeManager",
      },
    ])

    .then((answer) => {
      // print message "Added <employee first + last name> to the database"
      console.log("Added <employee first + last name> to the database");
      mainMenuQuestion();
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(
          "Success! (but no json file generated - something is probably missing from the generateJSON)",
          error
        );
      }
    });
}

function updateEmployeeRoleQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee do you want to update?",
        choices: ["", "", "", "", "", "", "", "", "", ""],
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
      console.log("Updated employee's role");
      mainMenuQuestion();
    })

    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(
          "Success! (but no json file generated - something is probably missing from the generateJSON)",
          error
        );
      }
    });
}

module.exports = mainMenuQuestion;
