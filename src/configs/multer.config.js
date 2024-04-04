'use strict'

const multer = require('multer');

const uploadMemory = multer({ storage: multer.memoryStorage() }); // use storage memory of server to upload -> not good option -> affect your app

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/')
    },
    filename: function (req, file, cb) {

      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

module.exports = {
  uploadDisk,
  uploadMemory
}