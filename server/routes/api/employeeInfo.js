const router = require('express').Router();
const EmployeeInfoController = require('../../controllers/EmployeeInfoController');
const multer = require('multer');
const mime = require('mime/lite');
const { can } = require('../../middlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/storage/public/profile-img');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.userId}.${mime.getExtension(file.mimetype)}`);
  }
});

const upload = multer({ storage });

router.post('/upload-profile-img', upload.single('profileImage'), can(['employeeInfoEditAll', 'employeeInfoEditOwn']), EmployeeInfoController.updateProfileImg);

router.get('/', can(['employeeInfoViewAll', 'employeeInfoViewOwn']), EmployeeInfoController.findById);

router.post('/', can(['userAdd']), EmployeeInfoController.create);

router.put('/', can(['employeeInfoEditAll', 'employeeInfoEditOwn']), EmployeeInfoController.update);

module.exports = router;
