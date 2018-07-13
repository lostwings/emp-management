const SelfAssessment = require('../models/SelfAssessment')

exports.check = (req,res,next) => {
  console.log('check self');
  SelfAssessment.checkExist(req.query.id)
    .then( exist => {
      res.json(exist)
    })
    .catch(next);
};

exports.find = (req,res,next) => {
  SelfAssessment.findById(req.query.id)
    .then( selfInfo =>{
      res.json(selfInfo)
    })
    .catch(next);
};

exports.create = (req,res,next) => {
  const newSelfAssessment = req.body.selfAssessmentInfo;
  console.log('create self');
  SelfAssessment.insertSelfAssessment(newSelfAssessment, req.user.id)
    .then(()=>{
      SelfAssessment.checkExist(req.body.selfAssessmentInfo.employeeID)
        .then( exist => {
          res.json(exist)
        })
    })
    .catch(next);
}

exports.update = (req,res,next) => {
  const newSelfAssessment = req.body.selfAssessmentInfo;
  SelfAssessment.updateSelfAssessment(newSelfAssessment, req.user.id)
    .then(()=>{
      SelfAssessment.checkExist(req.body.selfAssessmentInfo.employeeID)
        .then( exist =>{
          res.json(exist)
        })
    })
    .catch(next);
}
