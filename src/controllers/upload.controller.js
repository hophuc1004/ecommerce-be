'use strict'

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const { sListNotiByUser } = require("../services/notification.service")
const { sUploadImageFromUrl, sUploadImageFromLocal } = require("../services/upload.service")

class UploadController {
  uploadFileWithUrl = async (req, res, next) => {
    new SuccessResponse({
      message: 'Upload file success!',
      metadata: await sUploadImageFromUrl()
    }).send(res)
  }

  uploadFileLocalWithMulter = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw BadRequestError('File missing!')
    }

    new SuccessResponse({
      message: 'Upload file local with multer success!',
      metadata: await sUploadImageFromLocal({
        path: file.path,
      })
    }).send(res)
  }
}

module.exports = new UploadController();