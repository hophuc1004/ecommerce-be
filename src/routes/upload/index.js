'use strict'
const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router();
const { uploadDisk } = require('../../configs/multer.config');

// authentication
// router.use(authentication);

router.post('', asyncHandler(uploadController.uploadFileWithUrl));
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileLocalWithMulter));
router.post('/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadMultipleFileLocalWithMulter));


module.exports = router