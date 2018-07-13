const HasProject = require('../models/HasProject');
const Project = require('../models/Project');

exports.create = (req, res, next) => {
  const newHasProject = req.body.hasProject;
  console.log(newHasProject);
  HasProject.create(newHasProject, req.user.id)
    .then(() => {
      Project.findMemberProject(newHasProject.projectId)
        .then((hasProjects) => {
          res.json(hasProjects);
        })
        .catch(next);
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const editHasProject = req.body.hasProject;
  HasProject.update(editHasProject, req.user.id)
    .then((updatedHasProject) => {
      req.json(updatedHasProject);
    })
    .catch(next);
};

exports.findByUserId = (req, res, next) => {
  HasProject.findByUserId(req.query.id)
    .then((hasProjects) => {
      res.json(hasProjects);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  HasProject.delete(req.body.userId, req.body.projectId)
    .then(() => {
      Project.findMemberProject(req.body.projectId)
        .then((members) => {
          res.json(members);
        })
        .catch(next);
    })
    .catch(next);
};
