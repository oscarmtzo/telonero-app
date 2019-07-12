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
  showMusic,
  showEvents,
  postEvent,
  showMusic2,
  showEvents2
} = require("../controllers/auth.controllers");
const {
  getUploadImg,
  postUploadImg
} = require("../controllers/picture.controllers");

const Post = require("../models/post");

const {
  catchErrors,
  multer3,
  sendUploadToGCS
} = require("../middlewares/handlers");
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
router.get("/users/artistas/:id", showArtist2);
router.get("/users/:id", findOneUser);
router.post("/users/:id", postOther);
router.post("/users/add/:id", addUser);
router.get("/profile", getUploadImg);
router.get("/profile/music", showMusic);
router.get("/users/events/:id", showEvents2);
router.post("/profile/picture", uploadCloud.single("photo"), postPostImg2);
router.get("/profile/artistas", showArtist);
router.get("/profile/eventos", showEvents);
router.post("/profile/eventos", postEvent);
router.get("/users/music/:id", showMusic2);
router.post(
  "/profile/music",
  multer3.single("file"),
  sendUploadToGCS,
  (req, res, next) => {
    if (req.file && req.file.gcsUrl) {
      return res.send(req.file.gcsUrl);
    }

    return res.status(500).send("Unable to upload");
  }
);

module.exports = router;
