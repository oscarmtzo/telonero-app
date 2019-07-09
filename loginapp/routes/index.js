const router = require("express").Router();
const uploadCloud = require("../config/cloudinary")
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getProfile,
  logout
} = require("../controllers/auth.controllers");
const { 
  getUploadImg,
  postUploadImg
}  = require("../controllers/picture.controllers")
const {
  getPostImg,
  postPostImg
} = require("../controllers/postPicture.controllers")
const { catchErrors } = require("../middlewares/handlers");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", getSignup);
router.post("/signup", catchErrors(postSignup));

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/profile", isLoggedIn, getProfile);

router.get("/logout", logout);

router.get("/profile", getUploadImg )

router.post("/profile", uploadCloud.single('photo'), postUploadImg)

router.get("/profile", getPostImg)

router.post("/profile", uploadCloud.single('photo'),postPostImg)

module.exports = router;
