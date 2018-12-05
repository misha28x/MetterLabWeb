const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'backend/files');
	},
	filename: (req, file, cb) => {
		cb(null, file.filename + '-' + Date.now() + '.bbi');
	}
});

const upload = multer({
	storage: storage
});

router.post('', upload.single('file'), (req, res, next) => {
	// Add data to database
	console.log('uploaded');
});
``
module.exports = router;