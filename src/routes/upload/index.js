'use strict'
const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router();
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');

// authentication
// router.use(authentication);

// upload cloudinary
router.post('', asyncHandler(uploadController.uploadFileWithUrl));
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileLocalWithMulter));
router.post('/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadMultipleFileLocalWithMulter));

// upload s3
router.post('/s3', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileLocalToS3));


module.exports = router