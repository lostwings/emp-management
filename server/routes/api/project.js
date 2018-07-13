const router = require('express').Router();
const ProjectController = require('../../controllers/ProjectController');
const { can } = require('../../middlewares');

router.post('/', can(['projectAdd']), ProjectController.create);

router.put('/', can('projectEdit'), ProjectController.update);

router.get('/', can(['projectViewAll', 'projectViewOwn']), ProjectController.find);

router.delete('/', can(['projectDelete']), ProjectController.delete);

router.get('/', ProjectController.findAll);

module.exports = router;
