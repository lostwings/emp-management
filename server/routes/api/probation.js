const router = require('express').Router();
const ProbationController = require('../../controllers/ProbationController');

router.get('/check', ProbationController.check);
router.get('/', ProbationController.find);
router.post('/', ProbationController.create);
router.put('/', ProbationController.update);

module.exports = router;
