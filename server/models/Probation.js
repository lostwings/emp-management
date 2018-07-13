const db = require('../db/');
const mail = require('../mail');
const moment = require('moment');

const Probation = {};

Probation.checkExist = (id) => (
  db.manyOrNone("SELECT probation_id, pass_pro, continued, continued_date, md_sign_date FROM Probation WHERE user_id=$1 ORDER BY probation_id DESC",[id])
)

Probation.findProById = (id,proId) => (
  db.oneOrNone("SELECT * FROM Probation WHERE user_id=$1 AND probation_id=$2",[id,proId])
)

Probation.insertProbation = (probationInfo,id) =>(
  db.one("INSERT INTO Probation (user_id,pass_pro_date,based_salary,mobile,transporation_allowance,other_allowance,pass_pro,confirmed_by_employment,sup_comment,em_sign_date,sup_sign_date,md_sign_date,continued,score,expected_score,created_user,updated_user,terminated_date,continued_date,level_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 , $15 , $16 , $17, $18, $19, $20) RETURNING 1",
  [
    probationInfo.employeeID,
    probationInfo.endProbationDate,
    probationInfo.basedSalary,
    probationInfo.mobile,
    probationInfo.transporationAllowance,
    probationInfo.otherAllowance,
    probationInfo.passPro,
    probationInfo.confirmed,
    probationInfo.supervisorComment,
    null,
    null,
    null,
    probationInfo.continued,
    probationInfo.score,
    probationInfo.expectedScore,
    id,
    id,
    probationInfo.terminationDate,
    probationInfo.continuedDate,
    probationInfo.level
  ])
)

Probation.updateProbation = (probationInfo,id) =>(
  db.none(
    "UPDATE Probation SET pass_pro_date=$1, based_salary=$2, mobile=$3, transporation_allowance=$4, other_allowance=$5, pass_pro=$6, confirmed_by_employment=$7, sup_comment=$8, em_sign_date=$9, sup_sign_date=$10, md_sign_date=$11, continued=$12, score=$13, expected_score=$14, updated_user=$15, terminated_date=$16, continued_date=$17, updated_date=$18 WHERE user_id=$19 AND probation_id=$20",
    [
      probationInfo.endProbationDate,
      probationInfo.basedSalary,
      probationInfo.mobile,
      probationInfo.transporationAllowance,
      probationInfo.otherAllowance,
      probationInfo.passPro,
      probationInfo.confirmed,
      probationInfo.supervisorComment,
      probationInfo.employeeSignDate,
      probationInfo.supervisorSignDate,
      probationInfo.MDSignDate,
      probationInfo.continued,
      probationInfo.score,
      probationInfo.expectedScore,
      id,
      probationInfo.terminationDate,
      probationInfo.continuedDate,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      probationInfo.employeeID,
      probationInfo.proId
    ])
)

module.exports = Probation;
