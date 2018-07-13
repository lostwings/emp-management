const router = require('express').Router();
const UserController = require('../../controllers/UserController');
const { can } = require('../../middlewares');

router.get('/', UserController.findAll);

router.post('/', can(['userAdd']), UserController.create);

module.exports = router;
