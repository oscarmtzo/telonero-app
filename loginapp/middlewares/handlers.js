const Multer = require("multer");
const cloudinary = require("cloudinary");

exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});
