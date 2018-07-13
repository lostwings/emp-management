const WorkExperience = require('../models/WorkExperience');

exports.create = (req, res, next) => {
  const newWorkExperience = req.body.workExperience;
  WorkExperience.create(newWorkExperience, req.user.id)
    .then(() => {
      WorkExperience.findByUserId(newWorkExperience.userId)
        .then((workExperiences) => {
          res.json(workExperiences);
        })
        .catch(next);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  WorkExperience.findById(req.body.id)
    .then((workExperience) => {
      const { userId } = workExperience;
      WorkExperience.delete(req.body.id)
        .then(() => {
          WorkExperience.findByUserId(userId)
            .then((workExperiences) => {
              res.json(workExperiences);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

exports.findByUserId = (req, res, next) => {
  WorkExperience.findByUserId(req.query.userId)
    .then((workExperiences) => {
      res.json(workExperiences);
    })
    .catch(next);
};
