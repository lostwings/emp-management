const Project = require('../models/Project');
const HasProject = require('../models/HasProject');

const findHasProject = hasProjects => new Promise((resolve, reject) => {
  try {
    const projects = [];
    hasProjects.forEach((hasProject) => {
      Project.findById(hasProject.projectId)
        .then((project) => {
          Project.findMemberProject(project.id)
            .then((members) => {
              project.members = members;
              projects.push(project);
            });
        });
    });
    resolve(projects);
  }
  catch (error) {
    reject(error);
  }
});

exports.create = (req, res, next) => {
  const newProject = req.body.project;
  Project.create(newProject, req.user.id)
    .then((createdProject) => {
      res.json(createdProject);
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const editProject = req.body.project;
  Project.update(editProject, req.user.id)
    .then(() => {
      Project.findById(editProject.id)
        .then((project) => {
          Project.findMemberProject(editProject.id)
            .then((members) => {
              project.members = members;
              res.json(project);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

exports.find = async (req, res, next) => {
  if (req.accessControl.projectViewAll) {
    if (req.query.userId && req.query.year && req.query.month) {
      Project.findProjectByTimesheet(req.query.userId, req.query.year, req.query.month)
        .then((projects) => {
          res.json(projects);
        })
        .catch(next);
    }
    else if (req.query.id) {
      Project.findById(req.query.id)
        .then((project) => {
          Project.findMemberProject(req.query.id)
            .then((members) => {
              project.members = members;
              res.json(project);
            })
            .catch(next);
        })
        .catch(next);
    }
    else {
      Project.findAll()
        .then((projects) => {
          res.json(projects);
        })
        .catch(next);
    }
  }
  else if (req.accessControl.projectViewOwn) {
    if (req.query.userId && req.query.year && req.query.month) {
      Project.findProjectByTimesheet(req.query.userId, req.query.year, req.query.month)
        .then((projects) => {
          res.json(projects);
        })
        .catch(next);
    }
    else if (req.query.id) {
      const projects = await HasProject.findByUserId(req.user.id);
      if (projects.some(project => project.projectId === req.query.id)) {
        Project.findById(req.query.id)
          .then((project) => {
            Project.findMemberProject(req.params.id)
              .then((members) => {
                project.members = members;
                res.json(project);
              })
              .catch(next);
          })
          .catch(next);
      }
      else {
        res.status(401).json({
          message: `You don't have permission to do this.`
        });
      }
    }
    else {
      const hasProjects = await HasProject.findByUserId(req.user.id);
      findHasProject(hasProjects)
        .then((projects) => {
          res.json(projects);
        })
        .catch(next);
    }
  }
  else {
    res.status(401).json({
      message: `You don't have permission to do this.`
    });
  }
};

exports.delete = (req, res, next) => {
  Project.delete(req.body.id)
    .then(() => {
      Project.findAll()
        .then((projects) => {
          res.json(projects);
        })
        .catch(next);
    })
    .catch(next);
};
