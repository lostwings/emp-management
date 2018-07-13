const router = require('express').Router();
const LineController = require('../../controllers/LineController');

router.post('/create-line-code', LineController.createLineCode);

router.get('/find-user-info', LineController.findUserInfo);

module.exports = router;
