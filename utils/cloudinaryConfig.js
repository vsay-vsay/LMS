const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const dotenv = require("dotenv");

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadToCloudinary = async (filePath) => {
//   const result = await cloudinary.uploader.upload(filePath, {
//     resource_type: "auto"
//   });
//   fs.unlinkSync(filePath); // delete temp file
//   return result.secure_url;
// };

// module.exports = { uploadToCloudinary };
