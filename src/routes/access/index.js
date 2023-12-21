const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// signUp
router.post('/shop/sign-up', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// middleware authentication logout
// check that user is owner of this account and wanna to logout
router.use(authentication);

router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handle-refresh-token', asyncHandler(accessController.handlerRefreshToken))

module.exports = router