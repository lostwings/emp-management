const EmployeeInfo = require('../models/EmployeeInfo');

exports.createLineCode = (req, res, next) => {
  const newLineCode = req.body;
  EmployeeInfo.createLineCode(newLineCode.userId, newLineCode.lineCode, req.user.id)
    .then(() => {
      res.json('Create line code success!');
    })
    .catch(next);
};

exports.findUserInfo = (req, res, next) => {
  EmployeeInfo.findOwnByUserId(req.query.userId)
    .then((employeeInfo) => {
      res.json(employeeInfo);
    })
    .catch(next);
};
