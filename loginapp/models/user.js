const { model, Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true
    },
    artistas: Array,
    profileImg: {
      type: String,
      default:
        "https://ialmahue.com/wp-content/uploads/2017/12/profile-img-placeholder.png"
    },
    musica: Array,
    events: Array
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// We add steroids to our model, because of this, we don't have to add the "password" field to our model
userSchema.plugin(passportLocalMongoose, {
  // PLM by default register users with "username" and "password", we need to configure a different field
  usernameField: "email"
});

module.exports = model("User", userSchema);
