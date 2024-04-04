'use strict'
const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();
const multer = require('multer');
const { uploadDisk } = require('../../configs/multer.config');
const upload = multer({ dest: 'uploads/' })

// authentication
// router.use(authentication);

router.post('', asyncHandler(uploadController.uploadFileWithUrl));
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileLocalWithMulter));

module.exports = router