'use strict'

const cloudinary = require("../configs/cloudinary.config");

// 1. Upload from url image

const sUploadImageFromUrl = async () => {
  try {
    const urlImage = 'https://cdn2.cellphones.com.vn/x/media/catalog/product/2/_/2_69_12.jpg';
    const folderName = 'product/1004', newFileName = 'testdemo';

    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
      public_id: newFileName
    })
    return result
  } catch (error) {
    console.log('error:::::: ', error.message);
  }
}

// 2. Upload image from local
const sUploadImageFromLocal = async ({ path, folderName = 'product/1004' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folderName,
      public_id: 'thumb'
    })

    return {
      image_url: result.secure_url,
      shopId: 1004,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.log('error:::::: ', error.message);
  }
}

module.exports = {
  sUploadImageFromUrl,
  sUploadImageFromLocal
}
