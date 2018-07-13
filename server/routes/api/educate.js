const router = require('express').Router();
const EducateController = require('../../controllers/EducateController');
const { can } = require('../../middlewares');

router.post('/', can(['educateAdd']), EducateController.create);

router.put('/', can(['educateEdit']), EducateController.update);

router.get('/', can(['educateView']), EducateController.findByUserId);

router.delete('/', can(['educateDelete']), EducateController.delete);

module.exports = router;
