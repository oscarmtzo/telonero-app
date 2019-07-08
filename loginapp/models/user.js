//model/User.js
const mongoose      = require("mongoose")
const Schema        = mongoose.Schema

const userSchema = new Schema ({
  username: String,
  password: String
},  {
  timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User


//Schema definido para la contraseña y usuario
//Paso s:   1.- ejecutar irongenerate nombreDelArchivo 
//          2.- npm i, instalar las dependencias
//          3.- npm run dev
//          4.- Crear en el folder de modelos el archivo user.js donde se define el Schema para el usuario y la contraseña, este será el molde
//          5.- Crearemos el archivo de autorizacion de nombre authRoutes en el folder de rutas
//          6.- Instalamos en la terminal el paquete de bcrypt para la encriptacion con $npm install --save bcrypt
//          7.- Tambien vamos a nceesitar un formulario que permita a los usuarios registrarse e iniciar sesion por loq ue crearemos un archivo hbs el la carpeta de views, el cual formara parte de nuestras vistas lo llamaremos signup.hbs 
//          8.- Vamos a crear una ruta en app.js 
//          9.- vamos a crear el login, lo primero que debemos hacer es escoger la estrategia que vamos a usar, esto define como vamos a autenticar al usuario 
//          10.- instalamos passport y passport-local (los cuales nos permiten suar el nombre de usuario y la contraseña para iniciar sesion)
//          11.- una vez que instalamos y checamos los paquetes debedemos solicitarlos en el archivo de app.js
//          12.- Despues debemos configurar el middleware, donde primero configuramos express-session, indicando cual es la llave secreta que se usara usando app.use
//          13.-Despues debemos inicilaizar passport y passport session, ambos como middlewares
//          14.- El siguiente paso es definir los 3 metodos que passport necestia para trabajar, estos metodos son la estrategia, user serializer y user deserializer se usan las siguinetes configuraiones:
//           a.-Stretegy.- define que estrategia vamos a usar y su configuracion, esto incluyeel error
//           b.- User serializer y User deserializer. Ayudan a mantener la menor cantidad de datos in el sesion, estas definene que info es almacenada y como recuperar esta info de la base de datos