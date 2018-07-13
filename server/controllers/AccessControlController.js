const AccessControl = require('../models/AccessControl');
const User = require('../models/User');

exports.create = (req, res, next) => {
  const newAccessControl = req.body.accessControl;
  AccessControl.create(newAccessControl, req.user.id)
    .then((createdAccessControl) => {
      res.json(createdAccessControl);
    })
    .catch(next);
};

exports.findAll = (req, res, next) => {
  AccessControl.findAll()
    .then((accessControls) => {
      res.json(accessControls);
    })
    .catch(next);
exports.find = (req, res, next) => {
  if (req.query.all === 'true') {
    AccessControl.findAll()
      .then((accessControls) => {
        res.json(accessControls);
      })
      .catch(next);
  }
  else {
    User.findById(req.user.id)
      .then((user) => {
        AccessControl.findById(user.type)
          .then((accessControl) => {
            res.json(accessControl);
          })
          .catch(next);
      })
      .catch(next);
  }
};
