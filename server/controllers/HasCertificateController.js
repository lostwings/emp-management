const HasCertificate = require('../models/HasCertificate');

exports.create = (req, res, next) => {
  const newHasCertificate = req.body.hasCertificate;
  HasCertificate.create(newHasCertificate, req.user.id)
    .then(() => {
      HasCertificate.findByUserId(newHasCertificate.userId)
        .then((hasCertificates) => {
          res.json(hasCertificates);
        });
    })
    .catch(next);
};

exports.findByUserId = (req, res, next) => {
  HasCertificate.findByUserId(req.query.userId)
    .then((hasCertificates) => {
      res.json(hasCertificates);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  HasCertificate.findById(req.body.id)
    .then((hasCertificate) => {
      const { userId } = hasCertificate;
      HasCertificate.delete(req.body.id, req.user.id)
        .then(() => {
          HasCertificate.findByUserId(userId)
            .then((hasCertificates) => {
              res.json(hasCertificates);
            })
            .catch(next);
        })
        .catch(next);
    });
};
