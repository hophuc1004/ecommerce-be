'use strict'

const { SuccessResponse } = require("../core/success.response")
const { sListNotiByUser } = require("../services/notification.service")
const { sUploadImageFromUrl } = require("../services/upload.service")

class UploadController {
  uploadFileWithUrl = async (req, res, next) => {
    new SuccessResponse({
      message: 'Upload file success!',
      metadata: await sUploadImageFromUrl()
    }).send(res)
  }
}

module.exports = new UploadController();