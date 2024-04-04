'use strict'

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const { sUploadImageFromUrl, sUploadImageFromLocal, sUploadMultipleImageFromLocal } = require("../services/upload.service")

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

  uploadMultipleFileLocalWithMulter = async (req, res, next) => {
    const { files } = req;
    if (!files) {
      throw BadRequestError('Files missing!')
    }

    new SuccessResponse({
      message: 'Upload multiple file success!',
      metadata: await sUploadMultipleImageFromLocal({
        files
      })
    }).send(res)
  }
}

module.exports = new UploadController();