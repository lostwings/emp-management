const router = require('express').Router();
const HasAssetController = require('../../controllers/HasAssetController');
const multer = require('multer');
const mime = require('mime/lite');
const { can } = require('../../middlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/storage/private/asset');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}.${mime.getExtension(file.mimetype)}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('assetImage'), can(['hasAssetAdd']), HasAssetController.create);

router.get('/', HasAssetController.findByUserId);

router.delete('/', can(['hasAssetDelete']), HasAssetController.delete);

module.exports = router;
