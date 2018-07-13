const router = require('express').Router();
const LeaveRequestController = require('../../controllers/LeaveRequestController');
const { can } = require('../../middlewares');

router.post('/', LeaveRequestController.create);

router.put('/', can(['leaveRequestApprove', 'leaveRequestCancelAll', 'leaveRequestCancelOwn']), LeaveRequestController.update);

router.get('/', can(['leaveRequestViewAll', 'leaveRequestViewOwn']), LeaveRequestController.findLeaveRequest);

module.exports = router;
