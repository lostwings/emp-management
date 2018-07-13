const router = require('express').Router();
const WorkExperienceController = require('../../controllers/WorkExperienceController');
const { can } = require('../../middlewares');

router.post('/', can(['workExperienceAdd']), WorkExperienceController.create);

router.delete('/', can(['workExperienceDelete']), WorkExperienceController.delete);

router.get('/', can(['workExperienceView']), WorkExperienceController.findByUserId);

module.exports = router;
