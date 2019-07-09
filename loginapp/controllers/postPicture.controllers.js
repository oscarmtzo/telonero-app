const postPicture = require("../models/postPicture")
const cloudinary = require('cloudinary')
const uploadCloud = require("../config/cloudinary")
exports.getPostImg = async (req, res, next) =>{
    const pictures = await postPicture.find()
    res.render('/profile', { pictures })
}
exports.postPostImg = async (req, res, next) => {
    const {title, description} = req.body
    const { fieldname, originalname, url} = req.file
    console.log(req.file)
    await Picture.create({
        name: fieldname,
        path: url,
        originalName: originalname
    })
    res.redirect('/profile')
}