const Probation = require('../models/Probation');
const mail = require('../mail');

exports.check = (req,res,next) => {
  console.log('check');
  Probation.checkExist(req.query.id)
    .then((exist)=>{
      console.log(exist)
      res.json(exist);
    })
    .catch(next);
};

exports.find = (req, res, next) => {
    console.log('probation running')
    Probation.findProById(req.query.id,req.query.proId)
        .then((users) => {
            console.log(users)
            res.json(users);
        })
        .catch(next);
};

exports.create = (req,res,next) => {
  console.log(req)
  const newProbationInfo = req.body.probationInfo;
  Probation.insertProbation(newProbationInfo, req.user.id)
    .then(() => {
        Probation.checkExist(req.body.probationInfo.employeeID)
          .then((probations)=>{
            res.json(probations)
          });
    })
    .catch(next);
};

exports.update = (req,res,next) => {
  console.log('update probation');
  const newProbationInfo = req.body.probationInfo;
  if(req.body.probationInfo.supervisorSignDate != null){
    console.log('HIIII')
    const mailOptions = {
      from: 'i.plas.sa.tic@gmail.com',
      to: 'ruby.pwn@hotmail.com',
      subject: 'Probation',
      html:
        `
          <p>Probation of ${req.body.probationInfo.name} already sumitted</p>
        `
    };
    mail.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(info);
      }
    });
  }
  Probation.updateProbation(newProbationInfo, req.user.id)
    .then(() => {
      console.log("Test Probation");
      Probation.checkExist(req.body.probationInfo.employeeID)
        .then((probation)=>{
          res.json(probation)
        });
    })
    .catch(next);
};
