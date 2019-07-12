const { model, Schema } = require("mongoose");
const musicSchema = new Schema(
  {
    name: String,
    creatorId: String,
    path: String
  },
  {
    timestamps: true
  }
);

const Music = model("Music", musicSchema);
module.exports = Music;
