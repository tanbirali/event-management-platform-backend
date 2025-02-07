const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event_images", // Cloudinary folder
    allowedFormats: ["jpg", "png", "jpeg", "mp4", "mov"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

module.exports = upload;
