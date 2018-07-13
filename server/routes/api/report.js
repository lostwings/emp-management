const router = require('express').Router();
const ReportController = require('../../controllers/ReportController');

router.post('/', ReportController.createReport);
const { can } = require('../../middlewares');

router.get('/', can(['reportTimesheetNormalOwn', 'reportTimesheetNormalAll', 'reportTimesheetSpecialOwn',
  'reportTimesheetSpecialAll', 'reportSummaryTimesheetYear', 'reportSummaryLeave']), ReportController.createReport);

module.exports = router;
