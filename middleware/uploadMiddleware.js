const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage(); //Store file in memory before upload

const upload = multer({ storage });

module.exports = upload;
