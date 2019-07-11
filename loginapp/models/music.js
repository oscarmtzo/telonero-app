const { model, Schema } = require("mongoose");
const musicSchema = new Schema(
  {
    name: String,
    path: String,
    originalname: String
  },
  {
    timestamps: true
  }
);

const Music = model("Music", musicSchema);
module.exports = Music;
