const Picture = require("../models/picture");
const cloudinary = require("cloudinary");
const uploadCloud = require("../config/cloudinary");
exports.getUploadImg = (req, res, next) => {
  res.render("/profile");
};
exports.postUploadImg = async (req, res, next) => {
  const { fieldname, originalname, url } = req.file;
  console.log(req.file);
  await Picture.create({
    name: fieldname,
    path: url,
    originalname: originalname
  });
  res.redirect("/profile");
};
