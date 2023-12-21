const express = require('express');
const { apiKey, checkKeyPermission } = require('../auth/checkAuth');
const router = express.Router();


// check that api have using version of us
// check apiKey
router.use(apiKey);

// check permission of apiKey: is have permission have access to our system
router.use(checkKeyPermission('0000'));

router.use('/v1/api/auth', require('./access'));
router.use('/v1/api/product', require('./product'));

module.exports = router;