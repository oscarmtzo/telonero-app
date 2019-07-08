//routes/authRoutes.js
const express           = require("express")
const authRoutes        = express.Router()

//user model
const User              = require("../models/user")
 // passport require
 const passport = require("passport")

//bcrypt to encrypt passwords
const bcrypt            = require("bcrypt")
const bcryptSalt        = 10 //numero de iteraciones para la encriptacion de la contraseña
const ensureLogin       = require("connect-ensure-login")

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup")
})
authRoutes.post("/signup", (req, res, next) =>{
  const username = req.body.username
  const password = req.body.username //se usa el request o solicitud como parametro del metodo que significa que hara una solicitud al formulario en views /signup para tomar el password asi como el usuario
  if (username === "" ||password === ""){
    res.render("auth/signup", { message: "Indicate username and password"})
    return
  }
  User.findOne({ username })
  .then(user => {
    if ( user !== null){
      res.render("auth/signup", { message: "The username already exists"})
      return
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    
    const newUser = new User({
      username,
      password: hashPass
    })
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Somehthing went wrong"})
      } else {
        res.redirect("/")
      }
    })
  })
  .catch(error => {
    next(error)
  }) 
}) 
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") })
})

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user })
})

authRoutes.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/login")
})

  
module.exports = authRoutes