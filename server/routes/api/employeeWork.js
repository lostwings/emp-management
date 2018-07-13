const router = require('express').Router();
const EmployeeWorkController = require('../../controllers/EmployeeWorkController');
const { can } = require('../../middlewares');

router.post('/', can(['userAdd']), EmployeeWorkController.create);

router.get('/', can(['employeeWorkViewOwn', 'employeeWorkViewAll']), EmployeeWorkController.findByUserId);

router.put('/', can(['employeeWorkEdit']), EmployeeWorkController.update);

module.exports = router;
