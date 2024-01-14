'use strict';

const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// noti for user does not login

// noti for user have already login

// authentication
router.use(authentication);

router.get('', asyncHandler(notificationController.listNotiByUser));

module.exports = router