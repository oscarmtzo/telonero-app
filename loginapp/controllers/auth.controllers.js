const User = require("../models/User");
const passport = require("passport");
const Post = require("../models/post");
const postPicture = require("../models/postPicture");
const cloudinary = require("cloudinary");
const uploadCloud = require("../config/cloudinary");
const Picture = require("../models/picture");
const Music = require("../models/music");
const Event = require("../models/event");
const bucket = require("../config/googleStorage");

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

exports.getProfile = (req, res, next) => {
  console.log(req.query);
  const { json } = req.query;
  console.log(json);
  Post.find({ user: req.user.name }).then(post => {
    console.log(req.user.name);
    Event.find().then(events => {
      if (json) {
        console.log("perro");
        return res.json({ events });
      }
      return res.render("profile/private", { user: req.user, post, events });
    });
  });
};

exports.logout = (req, res, next) => {
  req.logOut();
  res.redirect("/login");
};
exports.findUsers = (req, res) => {
  User.find({ name: req.body.search })
    .then(users => {
      console.log(users);
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
      const usern = user.name;
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
exports.addUser = (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(
    req.user.id,
    { $push: { artistas: id } },
    { new: true, upsert: true },
    function(err, managerparent) {
      if (err) throw err;
      res.redirect(`/users/${id}`);
    }
  );
};
exports.showArtist = (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      let artistas = [];
      for (let i = 0; i < user.artistas.length; i++) {
        User.findById(user.artistas[i])
          .then(user2 => {
            artistas.push(user2);
          })
          .catch();
      }
      res.render("profile/featured", { user: req.user, artist: artistas });
    })
    .catch(err => console.log("Error!:", err));
};
exports.showMusic = (req, res) => {
  Music.find({ creatorId: req.user.id })
    .then(music => {
      res.render("profile/music", { music });
    })
    .catch();
};
exports.showMusic2 = (req, res) => {
  const { id } = req.params;
  User.find(req.params)
    .then(user => {
      Music.find({ creatorId: id })
        .then(music => {
          res.render("user_m", { music, id, user: req.user });
        })
        .catch();
    })
    .catch();
};
exports.showArtist2 = (req, res) => {
  let { id } = req.params;
  User.findById(id)
    .then(user => {
      console.log(user);
      let artistas = [];
      for (let i = 0; i < user.artistas.length; i++) {
        User.findById(user.artistas[i])
          .then(user2 => {
            artistas.push(user2);
          })
          .catch();
      }
      res.render("user_f", { user: req.user, artist: artistas, id });
    })
    .catch(err => console.log("Error!:", err));
};

exports.postPostImg2 = async (req, res, next) => {
  const { title, description } = req.body;
  const { fieldname, originalname, url } = req.file;

  await Picture.create({
    name: fieldname,
    path: url,
    originalName: originalname
  });
  User.findByIdAndUpdate(
    req.user.id,
    { $set: { profileImg: url } },
    { new: true, upsert: true },
    function(err, managerparent) {
      if (err) throw err;
      res.redirect("/profile");
    }
  );
};
exports.uploadMusic2 = (req, res) => {
  let file = req.file;
  const uploadImageToStorage = file => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("No image file");
      }
      let newFileName = `${file.originalname}_${Date.now()}`;

      let fileUpload = bucket.file(newFileName);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on("error", error => {
        reject("Something is wrong! Unable to upload at the moment.");
      });

      blobStream.on("finish", () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(
          `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
        );
        resolve(url);
      });

      blobStream.end(file.buffer);
    });
  };
  let name = req.body.name;
  let creatorId = req.user.id;
  if (file) {
    uploadImageToStorage(file)
      .then(success => {
        const newMusic = new Music({
          name,
          creatorId
        });
        newMusic.then(music => res.redirect("/profile/music"));
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    console.log("nada");
    res.redirect("/profile/music");
  }
};

exports.showEvents = (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("profile/events", { user: user, events: user.events });
    })
    .catch(err => console.log("Error!:", err));
};
exports.showEvents2 = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render("user_e", { user: req.user, events: user.events, id });
    })
    .catch(err => console.log("Error!:", err));
};

exports.postEvent = (req, res) => {
  const { name, description, fecha, latitud, longitud } = req.body;
  const { id } = req.params;

  User.findById(id)
    .then(user => {
      const newEvent = new Event({
        ...req.body,
        location: {
          coordinates: [Number(longitud), Number(latitud)]
        }
      });
      newEvent
        .save()
        .then(x => {
          User.findByIdAndUpdate(
            req.user.id,
            { $push: { events: x } },
            { new: true, upsert: true },
            function(err, managerparent) {
              if (err) throw err;
              res.redirect(`/profile/eventos`);
            }
          );
        })
        .catch(err => console.log("Error!:", err));
    })
    .catch();
};
