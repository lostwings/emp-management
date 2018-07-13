const db = require('../db');
const moment = require('moment');

const EmployeeInfo = {};

EmployeeInfo.create = (employeeInfo, id) => (
  db.one(
    'INSERT INTO employee_info (user_id, first_name, last_name, nick_name, mobile_number, line_id, email, facebook_id, picture, birthday, citizen_id, created_user, updated_user, address, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING 1',
    [
      employeeInfo.userId,
      employeeInfo.firstName,
      employeeInfo.lastName,
      employeeInfo.nickName,
      employeeInfo.mobileNumber,
      employeeInfo.lineId,
      employeeInfo.email,
      employeeInfo.facebookId,
      employeeInfo.picture,
      employeeInfo.birthday,
      employeeInfo.citizenId,
      id,
      id,
      employeeInfo.address,
      employeeInfo.gender
    ]
  )
);

EmployeeInfo.updateAll = (employeeInfo, id) => (
  db.one(
    `UPDATE employee_info
    SET
    first_name = $1,
    last_name = $2,
    nick_name = $3,
    mobile_number = $4,
    line_id = $5,
    email = $6,
    facebook_id = $7,
    picture = $8,
    birthday = $9,
    citizen_id = $10,
    updated_user = $11,
    address = $12,
    updated_date = $13,
    first_name_th = $14,
    last_name_th = $15,
    gender = $16
    WHERE user_id = $17
    RETURNING user_id`,
    [
      employeeInfo.firstName,
      employeeInfo.lastName,
      employeeInfo.nickName,
      employeeInfo.mobileNumber,
      employeeInfo.lineId,
      employeeInfo.email,
      employeeInfo.facebookId,
      employeeInfo.picture,
      employeeInfo.birthday,
      employeeInfo.citizenId,
      id,
      employeeInfo.address,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      employeeInfo.firstNameTh,
      employeeInfo.lastNameTh,
      employeeInfo.gender,
      employeeInfo.userId
    ]
  )
    .then(result => db.one(`SELECT * FROM employee_info WHERE user_id = $1`, [result.userId]))
);

EmployeeInfo.updateOwn = (employeeInfo, id) => (
  db.one(
    `UPDATE employee_info SET mobile_number = $1, line_id = $2, facebook_id = $3, updated_date = $4, updated_user = $5 WHERE user_id = $6 RETURNING user_id`,
    [
      employeeInfo.mobileNumber,
      employeeInfo.lineId,
      employeeInfo.facebookId,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      id,
      employeeInfo.userId
    ]
  )
    .then(result => db.one(`SELECT * FROM employee_info WHERE user_id = $1`, [result.userId]))
);

EmployeeInfo.findAllByUserId = userId => (
  db.oneOrNone('SELECT * FROM employee_info WHERE user_id = $1', [userId])
);

EmployeeInfo.findOwnByUserId = userId => (
  db.oneOrNone('SELECT first_name, last_name, nick_name, mobile_number, line_id, email, facebook_id, picture, address, first_name_th, last_name_th, gender, user_id FROM employee_info WHERE user_id = $1', [userId])
);

EmployeeInfo.updateProfileImg = (path, userId, id) => (
  db.none(
    'UPDATE employee_info SET picture = $1, updated_user = $2, updated_date = $3 WHERE user_id = $4',
    [
      path,
      id,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      userId
    ]
  )
);

EmployeeInfo.createLineCode = (userId, lineCode, id) => (
  db.none(
    'UPDATE employee_info SET line_code = $1, updated_user = $2, updated_date = $3 WHERE user_id = $4',
    [
      lineCode,
      id,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      userId
    ]
  )
);

module.exports = EmployeeInfo;
