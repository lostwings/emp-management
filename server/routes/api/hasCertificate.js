const router = require('express').Router();
const HasCertificateController = require('../../controllers/HasCertificateController');
const { can } = require('../../middlewares');

router.post('/', can(['hasCertificateAdd']), HasCertificateController.create);

router.get('/', HasCertificateController.findByUserId);

router.delete('/', can(['hasCertificateDelete']), HasCertificateController.delete);

module.exports = router;
