const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const EmployeeWork = require('../models/EmployeeWork');
const Level = require('../models/Level');
const LeaveHistory = require('../models/LeaveHistory');
const moment = require('moment');
const mail = require('../mail');
const mailAddUser = require('../mail_template/mailAddUser');

const createLeaveHistory = (userId, id) => new Promise(async (resolve, reject) => {
  try {
    const employeeWork = await EmployeeWork.findAllByUserId(userId);
    const level = await Level.findById(employeeWork.levelId);
    const leave = {};
    leave.userId = userId;
    leave.year = moment(employeeWork.probationDate).format('YYYY');
    leave.sickLeaveRemain = 240;
    leave.personalLeaveRemain = 48;
    leave.ordinationLeaveRemain = 0;
    let hour = 0;
    if (moment(employeeWork.probationDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')) {
      const leaveLevel = level.annualLeave;
      hour += (12 - (moment(employeeWork.probationDate).month() + 1)) * (leaveLevel / 12) * 8;
      if (parseInt(moment(employeeWork.probationDate).format('DD'), 10) < 15) {
        hour += 8;
      }
      else {
        hour += 4;
      }
    }
    else {
      hour += 0;
    }
    leave.annualLeaveRemain = hour;
    LeaveHistory.create(leave, id)
      .then(() => {
        resolve(userId);
      });
  }
  catch (error) {
    reject(error);
  }
});

exports.findAll = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
};

exports.create = (req, res, next) => {
  const newUser = req.body.user;
  const pass = 'playtorium';
  User.findByName(newUser.firstName, newUser.lastName)
    .then((user1) => {
      if (user1) {
        const err = new Error('User already exit');
        err.status = 409;
        next(err);
      }
      else {
        User.findByUsername(newUser.username)
          .then((user) => {
            if (user) {
              const err = new Error('Username already exist');
              err.status = 409;
              next(err);
            }
            else {
              const name = `${newUser.firstName} ${newUser.lastName}`;
              newUser.password = bcrypt.hashSync(pass, bcrypt.genSaltSync());
              if (newUser.gender === 'Male') {
                newUser.picture = '/static/profile-img/man.jpg';
              }
              else {
                newUser.picture = '/static/profile-img/woman.jpg';
              }
              User.create(newUser, req.user.id)
                .then((result) => {
                  createLeaveHistory(result.userId, req.user.id)
                    .then(() => {
                      const mailOptions = {
                        from: process.env.MAIL_USER,
                        to: newUser.username,
                        subject: 'Playtorium Account Information',
                        html: mailAddUser(newUser.username, pass, name)
                      };
                      mail.sendMail(mailOptions, (err, info) => {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          console.log(info);
                        }
                      });
                      res.end();
                    })
                    .catch(next);
                })
                .catch(next);
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};
