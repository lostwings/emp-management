const db = require('../db');

const User = {};

// User.create = (user, id) => (
//   db.tx((transaction) => {
//     const q1 = transaction.one(
//       'INSERT INTO users (username, password, created_user, updated_user, type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
//       [
//         user.username,
//         user.password,
//         id,
//         id,
//         user.type,
//       ]
//     );
//     const q2 = transaction.one(
//       'INSERT INTO employee_info (first_name, last_name, citizen_id, created_user, updated_user, email, gender, picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
//       [
//         user.firstName,
//         user.lastName,
//         user.citizenId,
//         id,
//         id,
//         user.username,
//         user.gender,
//         user.picture
//       ]
//     );
//     const q3 = transaction.one(
//       'INSERT INTO employee_work (department_id, level_id, start_date, probation_date, created_user, updated_user, contract_id, engineer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
//       [
//         user.departmentId,
//         user.levelId,
//         user.startDate,
//         user.probationDate,
//         id,
//         id,
//         user.contractId,
//         user.engineer
//       ]
//     );
//     return transaction.batch([q1, q2, q3]);
//   })
// );

User.create = async (user, id) => (
  db.one(
    'INSERT INTO users (username, password, created_user, updated_user, type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [
      user.username,
      user.password,
      id,
      id,
      user.type,
    ]
  )
    .then((result) => {
      console.log(result.id);
      db.none(
        'INSERT INTO employee_info (first_name, last_name, citizen_id, created_user, updated_user, email, gender, picture, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          user.firstName,
          user.lastName,
          user.citizenId,
          id,
          id,
          user.username,
          user.gender,
          user.picture,
          result.id
        ]
      )
        .then(() => {
          db.none(
            'INSERT INTO employee_work (department_id, level_id, start_date, probation_date, created_user, updated_user, contract_id, engineer, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id',
            [
              user.departmentId,
              user.levelId,
              user.startDate,
              user.probationDate,
              id,
              id,
              user.contractId,
              user.engineer,
              result.id
            ]
          );
        });
    })
);

User.findById = id => (
  db.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
);

User.findByUsername = username => (
  db.oneOrNone('SELECT * FROM users WHERE username = $1', [username])
);

User.findAll = () => (
  db.manyOrNone(`SELECT users.id, employee_info.first_name, employee_info.last_name, employee_info.nick_name,
  employee_info.mobile_number, employee_info.email, employee_info.picture, employee_work.department_id,
  departments.name AS department_name, positions.name AS position_name FROM users INNER JOIN employee_info ON
  users.id = employee_info.user_id AND users.status = $1 INNER JOIN employee_work ON users.id = employee_work.user_id
  INNER JOIN departments ON employee_work.department_id = departments.id
  LEFT OUTER JOIN positions ON employee_work.position_id = positions.id
  ORDER BY users.id`, ['Active'])
);

User.findByName = (firstName, lastName) => (
  db.oneOrNone('SELECT * FROM employee_info WHERE first_name = $1 AND last_name = $2', [firstName, lastName])
);

// User.createAdmin = user => (
//   db.one(
//     'INSERT INTO users (username, password, created_user, updated_user, type, status, id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//     [
//       user.username,
//       user.password,
//       10000,
//       10000,
//       1,
//       'Active',
//       10000
//     ]
//   )
// );

module.exports = User;
