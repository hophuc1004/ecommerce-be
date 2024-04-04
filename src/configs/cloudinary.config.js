'use strict'

// Require the cloudinary library
const cloudinary = require('cloudinary').v2

console.log('process.env.CLOUDINARY_API_NAME::: ', process.env.CLOUDINARY_API_NAME);
console.log('process.env.CLOUDINARY_API_KEY::: ', process.env.CLOUDINARY_API_KEY);
console.log('process.env.CLOUDINARY_API_SECRET::: ', process.env.CLOUDINARY_API_SECRET);

// Return 'https' URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Log the configuration
console.log('cloudinaryLog:::::: ', cloudinary.config());

module.exports = cloudinary;