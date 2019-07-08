//routes/authRoutes.js
const express           = require("express")
const authRoutes        = express.Router()

//user model
const User              = require("../models/user")


//bcrypt to encrypt passwords
const bcrypt            = require("bcrypt")
const bcryptSalt        = 10 //numero de iteraciones para la encriptacion de la contraseña
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
module.exports = authRoutes