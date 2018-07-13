const db = require('../db');

const Toeic = {};

Toeic.create = (toeic, id) => (
  db.none(
    'INSERT INTO toeic (user_id, score, date, created_user, updated_user) VALUES ($1, $2, $3, $4, $5)',
    [
      toeic.userId,
      toeic.score,
      toeic.date,
      id,
      id
    ]
  )
);

Toeic.findByUserId = userId => (
  db.manyOrNone('SELECT * FROM toeic WHERE user_id = $1 ORDER BY score DESC, date DESC', [userId])
);

Toeic.delete = id => (
  db.none('DELETE FROM toeic WHERE id = $1', [id])
);

Toeic.findById = id => (
  db.one('SELECT * FROM toeic WHERE id = $1', [id])
);

module.exports = Toeic;
