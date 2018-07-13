const router = require('express').Router();
const employeeInfo = require('./employeeInfo');
const employeeWork = require('./employeeWork');
const user = require('./user');
const position = require('./position');
const department = require('./department');
const level = require('./level');
const contract = require('./contract');
const educate = require('./educate');
const hasCertificate = require('./hasCertificate');
const hasAsset = require('./hasAsset');
const assetType = require('./assetType');
const asset = require('./asset');
const certificate = require('./certificate');
const degree = require('./degree');
const faculty = require('./faculty');
const major = require('./major');
const university = require('./university');
const file = require('./file');
const hasProject = require('./hasProject');
const holiday = require('./holiday');
const project = require('./project');
const timesheet = require('./timesheet');
const leaveRequest = require('./leaveRequest');
const accessControl = require('./accessControl');
const report = require('./report');
const masterATable = require('./masterTable');
const workExperience = require('./workExperience');
const leaveHistory = require('./leaveHistory');
const toeic = require('./toeic');
const promoteHistory = require('./promoteHistory');
const line = require('./line');
const probation = require('./probation');
const performance = require('./performance');
const selfAssessment = require('./selfAssessment');

router.use('/employee-info', employeeInfo);

router.use('/employee-work', employeeWork);

router.use('/users', user);

router.use('/positions', position);

router.use('/departments', department);

router.use('/levels', level);

router.use('/contracts', contract);

router.use('/educates', educate);

router.use('/has-certificates', hasCertificate);

router.use('/has-assets', hasAsset);

router.use('/asset-types', assetType);

router.use('/assets', asset);

router.use('/certificates', certificate);

router.use('/degrees', degree);

router.use('/faculties', faculty);

router.use('/majors', major);

router.use('/universities', university);

router.use('/files', file);

router.use('/has-projects', hasProject);

router.use('/holidays', holiday);

router.use('/projects', project);

router.use('/timesheets', timesheet);

router.use('/leave-request', leaveRequest);

router.use('/access-control', accessControl);

router.use('/report', report);

router.use('/master-table', masterATable);

router.use('/work-experience', workExperience);

router.use('/leave-history', leaveHistory);

router.use('/toeic', toeic);

router.use('/promote-history', promoteHistory);

router.use('/line', line);

router.use('/probation', probation);

router.use('/performance', performance);

router.use('/selfassessment', selfAssessment);

module.exports = router;
