INSERT INTO department (id, name)
VALUES
    ( 1, "sampleName1"),
    ( 2, "sampleName2"),
    ( 3, "sampleName3");

INSERT INTO role (id, title, salary, department_id)
VALUES
    ( 1, "apple"),
    ( 2, "orange"),
    ( 3, "banana");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    ( 1, "apple"),
    ( 2, "orange"),
    ( 3, "banana");