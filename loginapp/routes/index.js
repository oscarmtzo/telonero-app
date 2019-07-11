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
  postOther,
  addUser,
  showArtist,
  postPostImg2,
  showArtist2,
  uploadMusic2,
  showMusic,
  showEvents,
  postEvent
} = require("../controllers/auth.controllers");
const {
  getUploadImg,
  postUploadImg
} = require("../controllers/picture.controllers");

const Post = require("../models/post");

const { catchErrors, uploadMusic } = require("../middlewares/handlers");
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
router.post("/user/artistas/:id", showArtist2);
router.get("/users/:id", findOneUser);
router.post("/users/:id", postOther);
router.post("/users/add/:id", addUser);
router.get("/profile", getUploadImg);
router.post("/profile/music", uploadMusic2);
router.get("/profile/music", showMusic);
router.post("/profile/picture", uploadCloud.single("photo"), postPostImg2);
router.post("/profile/artistas", showArtist);
router.get("/profile/eventos", showEvents);
router.post("/profile/eventos", postEvent);
module.exports = router;
