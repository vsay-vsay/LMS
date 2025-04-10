// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const {uploadToCloudinary}  = require("../utils/cloudinaryConfig");

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "courses", // Folder name in Cloudinary
//         format: async (req, file) => "jpg", 
//         public_id: (req, file) => `${Date.now()}-${file.originalname}`,
//     },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const  cloudinary = require("../utils/cloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const allowedFormats = ["jpg", "jpeg", "png", "mp4", "pdf", "docx", "xlsx", "txt", "pptx"];
      const fileFormat = file.originalname.split('.').pop().toLowerCase();
  
      if (!allowedFormats.includes(fileFormat)) {
        throw new Error("Unsupported file format");
      }
  
      return {
        folder: "courses", // Cloudinary folder
        resource_type: "auto", // auto-detect (image, video, raw, etc.)
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    },
  });
  
  // ✅ Multer setup using Cloudinary storage
  const upload = multer({ storage });
  
  module.exports = upload;