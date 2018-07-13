const db = require('../db');

const HasCertificate = {};

HasCertificate.create = (hasCertificate, id) => (
  db.one(
    'INSERT INTO has_certificates (user_id, certificate_id, certificate_date, score, created_user, updated_user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING 1',
    [
      hasCertificate.userId,
      hasCertificate.certificateId,
      hasCertificate.certificateDate,
      hasCertificate.score,
      id,
      id
    ]
  )
);

HasCertificate.findByUserId = userId => (
  db.manyOrNone('SELECT has_certificates.user_id AS user_id, has_certificates.certificate_id AS certificate_id, has_certificates.certificate_date AS certificate_date, has_certificates.score AS score, has_certificates.id AS id, certificates.name AS name, certificates.institute AS institute FROM has_certificates, certificates WHERE has_certificates.certificate_id = certificates.id AND has_certificates.user_id = $1 ORDER BY has_certificates.certificate_date DESC', [userId])
);

HasCertificate.delete = id => (
  db.none('DELETE FROM has_certificates WHERE id = $1', [id])
);

HasCertificate.findById = id => (
  db.oneOrNone('SELECT * FROM has_certificates WHERE id = $1', [id])
);

module.exports = HasCertificate;
