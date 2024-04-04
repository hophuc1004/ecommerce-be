'use strict'
const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
// router.use(authentication);

router.post('', asyncHandler(uploadController.uploadFileWithUrl))

module.exports = router