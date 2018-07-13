const Toeic = require('../models/Toeic');

exports.create = (req, res, next) => {
  const newToeic = req.body.toeic;
  Toeic.create(newToeic, req.user.id)
    .then(() => {
      Toeic.findByUserId(newToeic.userId)
        .then((toeics) => {
          res.json(toeics);
        })
        .catch(next);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  Toeic.findById(req.body.id)
    .then((toeic) => {
      const { userId } = toeic;
      Toeic.delete(req.body.id)
        .then(() => {
          Toeic.findByUserId(userId)
            .then((toeics) => {
              res.json(toeics);
            })
            .catch(next);
        })
        .catch(next);
    });
};

exports.findByUserId = (req, res, next) => {
  Toeic.findByUserId(req.query.userId)
    .then((toeics) => {
      res.json(toeics);
    })
    .catch(next);
};
