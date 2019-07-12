const Multer = require("multer");
const cloudinary = require("cloudinary");
const Music = require("../models/music");
exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);
const gcsHelpers = require("../config/googleStorage");

const { storage } = gcsHelpers;

const DEFAULT_BUCKET_NAME = "teloneros";

exports.sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const bucketName = req.body.bucketName || DEFAULT_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);
  const newMusic = new Music({
    name: req.body.nombre,
    creatorId: req.user.id,
    path: `https://storage.googleapis.com/teloneros/${gcsFileName}`
  });
  newMusic.save();
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    req.file.cloudStorageError = err;
    res.redirect("/profile/music");
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsFileName;

    return file.makePublic().then(() => {
      req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
      res.redirect("/profile/music");
      next();
    });
  });
  res.redirect("/profile/music");
  stream.end(req.file.buffer);
};

exports.multer3 = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Maximum file size is 10MB
  }
});
