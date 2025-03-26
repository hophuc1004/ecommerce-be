'use strict'

const cloudinary = require("../configs/cloudinary.config");
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomImageName } = require("../utils");

// 1. Upload from url image

const sUploadImageFromUrl = async () => {
  const urlImage = 'https://cdn2.cellphones.com.vn/x/media/catalog/product/2/_/2_69_12.jpg';
  const folderName = 'product/1004', newFileName = 'testdemo';

  const result = await cloudinary.uploader.upload(urlImage, {
    folder: folderName,
    public_id: newFileName
  })
  return result
}

// 2. Upload image from local
const sUploadImageFromLocal = async ({ path, folderName = 'product/1004' }) => {
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
}

// 3. Upload multiple image from local
const sUploadMultipleImageFromLocal = async ({
  files, folderName = 'product/1004'
}) => {
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

}

// 4. Upload service using S3 client
const uploadImageToS3FromLocal = async ({ file }) => {
  const imageName = randomImageName();

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_S3_NAME,
    Key: imageName,
    Body: file.buffer, // Body of command to upload image to s3 is buffer, and buffer exist in memoryStorage of multer
    ContentType: 'image/jpeg'
  })

  await s3.send(command);

  const signedUrl = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_S3_NAME,
    Key: imageName
  })

  // after upload, we export and public url for user to use
  const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
  console.log('url:', url)

  return url;
}


module.exports = {
  sUploadImageFromUrl,
  sUploadImageFromLocal,
  sUploadMultipleImageFromLocal,
  uploadImageToS3FromLocal
}
