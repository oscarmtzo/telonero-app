const User = require("../models/User");
const passport = require("passport");
const Post = require("../models/post");
const postPicture = require("../models/postPicture");
const cloudinary = require("cloudinary");
const uploadCloud = require("../config/cloudinary");
const Picture = require("../models/picture");
const Music = require("../models/music");
const Event = require("../models/event");
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
    Event.find().then(events =>
      res.render("profile/private", { user: req.user, post, events })
    );
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
  User.findById(req.user.id).then(user => {
    let musica = [];
    for (let i = 0; i < user.artistas.length; i++) {
      User.findById(user.musica[i])
        .then(user2 => {
          musica.push(user2);
        })
        .catch();
    }
    res.render("profile/music", { user: req.user, music: musica });
  });
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
      res.render("profile/featured", { user: req.user, artist: artistas });
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
exports.uploadMusic2 = async (req, res, next) => {
  let b;
  const a = await cloudinary.uploader.upload(
    "music",
    function(result) {
      b = result.url;
      res.send({
        result: result,
        serverStatus: 200,
        response_message: "audio uploaded"
      });
    },
    {
      resource_type: "video"
    }
  );
  const { fieldname, originalname, url } = a;
  await Music.create({
    name: fieldname,
    path: url,
    originalName: originalname
  });
  User.findByIdAndUpdate(
    req.user.id,
    { $push: { musica: b } },
    { new: true, upsert: true },
    function(err, managerparent) {
      if (err) throw err;
      res.redirect(`/profile/music`);
    }
  );
};

exports.showEvents = (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("profile/events", { user: user, events: user.events });
    })
    .catch(err => console.log("Error!:", err));
};
exports.postEvent = (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const fecha = req.body.fecha;
  const latitud = req.body.latitud;
  const longitud = req.body.longitud;
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      const newPost = new Event({
        name,
        description,
        fecha,
        latitud,
        longitud
      });
      newPost
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
