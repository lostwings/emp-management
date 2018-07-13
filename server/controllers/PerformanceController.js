const Performance = require('../models/Performance');

exports.check = (req,res,next) => {
  console.log('check');
  Performance.checkExist(req.query.id)
    .then((exist)=>{
      console.log(exist)
      res.json(exist);
    })
    .catch(next);
};

exports.find = (req,res,next) => {
  console.log('fetch perf')
  Performance.findById(req.query.id,req.query.year)
    .then((performance) => {
        res.json(performance);
    })
    .catch(next);
};

exports.create = (req,res,next) => {
  console.log('create perf')
  const newPerformanceInfo = req.body.performanceInfo;
  Performance.insertPerformance(newPerformanceInfo, req.user.id)
    .then(() => {
        Performance.checkExist(req.body.performanceInfo.employeeID)
          .then((performance)=>{
            res.json(performance)
          });
    })
    .catch(next);
};

exports.update = (req,res,next) => {
  console.log('update performance');
    const newPerformanceInfo = req.body.performanceInfo;
    Performance.updatePerformance(newPerformanceInfo, req.user.id)
      .then(() => {
        console.log("Test Probation");
        Performance.checkExist(req.body.performanceInfo.employeeID)
          .then((performance)=>{
            res.json(performance)
          });
      })
      .catch(next);
};
