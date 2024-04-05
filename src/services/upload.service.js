'use strict'

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const cloudinary = require("../configs/cloudinary.config");
const s3Config = require("../configs/s3.config");
const crypto = require('crypto');

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
    console.log('errorUploadFromUrl:::::: ', error.message);
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
      thumb_url: cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.log('errorUploadSingleLocal:::::: ', error.message);
  }
}

// 3. Upload multiple image from local
const sUploadMultipleImageFromLocal = async ({
  files, folderName = 'product/1004'
}) => {
  try {
    if (!files.length) return;
    const uploadUrls = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName
      })

      uploadUrls.push({
        image_url: result.secure_url,
        shopId: 1004,
        thumb_url: cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg'
        })
      })
    }

    return uploadUrls;

  } catch (error) {
    console.log('errorUploadMultipleLocal:::: ', error.message);
  }
}

// 4. Upload service using S3 client
const uploadImageToS3FromLocal = async ({ file }) => {
  try {

    const randomImageName = () => crypto.randomBytes(16).toString('hex');

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_S3_NAME,
      Key: randomImageName(),
      Body: file.buffer, // Body of command to upload image to s3 is buffer, and buffer exist in memoryStorage of multer
      ContentType: 'image/jpeg'
    })

    const result = await s3Config.send(command);

    return result;

  } catch (error) {
    console.log('errorUploadS3::::: ', error.message);
  }
}


module.exports = {
  sUploadImageFromUrl,
  sUploadImageFromLocal,
  sUploadMultipleImageFromLocal,
  uploadImageToS3FromLocal
}
