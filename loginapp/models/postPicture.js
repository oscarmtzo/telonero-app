const { model, Schema } = require("mongoose")
const pictureSchema = new Schema({
    title: String,
    description: String,
    name: String,
    path: String,
    originalname: String
    
},{
    timestamps: true
})

const postPicture = model("postPicture", pictureSchema)
module.exports = postPicture 