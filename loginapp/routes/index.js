const router = require("express").Router();
const uploadCloud = require("../config/cloudinary");
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getProfile,
  logout,
  findUsers,
  findOneUser,
  postOther
} = require("../controllers/auth.controllers");
const Post = require("../models/post");
const { catchErrors } = require("../middlewares/handlers");
const { isLoggedIn } = require("../middlewares/auth");

// ...

router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", getSignup);
router.post("/signup", catchErrors(postSignup));

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/profile", isLoggedIn, getProfile);

router.get("/logout", logout);

router.post("/profile", (req, res) => {
  const content = req.body.content;
  const creatorId = req.user._id;
  const name = req.user.name;
  const user = req.user.name;
  const newPost = new Post({ name, content, creatorId, user });
  newPost
    .save()
    .then(x => {
      res.redirect("/profile");
    })
    .catch(err => console.log("Error!:", err));
});
router.post("/users", findUsers);
router.get("/users/:id", findOneUser);
router.post("/users/:id", postOther);
module.exports = router;
