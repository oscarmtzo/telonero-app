const { model, Schema } = require("mongoose")
const pictureSchema = new Schema({
    name: String,
    path: String,
    originalname: String
    
},{
    timestamps: true
})

const Picture = model("Picture", pictureSchema)
module.exports = Picture 