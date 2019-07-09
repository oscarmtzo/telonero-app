const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = Schema(
  {
    name: String,
    content: String,
    creatorId: String,
    user: String,
    picPath: String,
    picName: String,
    picUrl: String
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
