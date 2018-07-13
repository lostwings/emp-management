const db = require('../db');
const moment = require('moment');

const WorkExperience = {};

WorkExperience.create = (workExperience, id) => (
  db.none(
    'INSERT INTO work_experience (user_id, duration, company, position, description, created_user, updated_user) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [
      workExperience.userId,
      workExperience.duration,
      workExperience.company,
      workExperience.position,
      workExperience.description,
      id,
      id
    ]
  )
);

WorkExperience.delete = id => (
  db.none('DELETE FROM work_experience WHERE id = $1', [id])
);

WorkExperience.findByUserId = userId => (
  db.manyOrNone('SELECT * FROM work_experience WHERE user_id = $1', [userId])
);

WorkExperience.findById = id => (
  db.one('SELECT * FROM work_experience WHERE id = $1', [id])
);

module.exports = WorkExperience;
