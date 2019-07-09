const User = require("../models/User");
const passport = require("passport");
const Post = require("../models/post");

exports.getSignup = (req, res, next) => res.render("auth/signup");

exports.postSignup = async (req, res, next) => {
  // We can use the method "register" because of the plugin PLM,
  // the first parameter is the info of the user, the second parameter is the password for the user
  const user = await User.register({ ...req.body }, req.body.password);
  // Just for feedback
  console.log("The user registered:", user);
  res.redirect("/login");
};

exports.getLogin = (req, res, next) => res.render("auth/login");

exports.postLogin = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/profile"
});

exports.getProfile = (req, res, next) =>
  Post.find({ user: req.user.name }).then(post => {
    console.log(req.user.name);
    res.render("profile/private", { user: req.user, post });
  });

exports.logout = (req, res, next) => {
  req.logOut();
  res.redirect("/login");
};
exports.findUsers = (req, res) => {
  User.find({ name: req.body.search })
    .then(users => {
      res.render("users", { user: req.user, users });
    })
    .catch(err => console.log("Error!:", err));
};
exports.findOneUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      Post.find({ user: user.name }).then(post => {
        res.render("user", { user: req.user, post, id });
      });
    })
    .catch(err => console.log("Error!:", err));
};
exports.postOther = (req, res) => {
  const content = req.body.content;
  const creatorId = req.user._id;
  const name = req.user.name;
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      console.log(user);
      const usern = user.name;
      console.log(usern);
      const newPost = new Post({ name, content, creatorId, user: usern });
      newPost
        .save()
        .then(x => {
          res.redirect(`/users/${id}`);
        })
        .catch(err => console.log("Error!:", err));
    })
    .catch();
};
