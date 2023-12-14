const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cors = require("cors");

const {
  vender,
  consultarProducto,
  registrarUsuario,
  obtenerDatosUsuario,
  verificarCredenciales,
  consultarProductos,
} = require("./consultas.js");

const { checkearCredenciales, verificarToken } = require("./middlewares.js");

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/auth", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", checkearCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await verificarCredenciales(email, password);
    console.log("Usuario:", usuario);
    const token = jwt.sign({ email }, "llaveSecreta");
    console.log("Token:", token);
    res.send(token);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/landing", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).send("El token no es valido");
  }
});

app.post("/registrarse", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.status(201).send("usuario creado con exito");
  } catch (error) {
    console.log(error);
    res.status(500).send("Ha ocurrido un error al registrar el usuario");
  }
});

app.get("/landing2", verificarToken, async (req, res) => {
  try {
    const productos = await consultarProductos();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/perfil", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});  

app.get("/producto/:titulo", verificarToken, async (req, res) => {
  try {
    const { titulo } = req.params;
    const producto = await consultarProducto(titulo);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.post("/vender", verificarToken, async (req, res) => {
  try {
    const { titulo, formato, imagen, precio } = req.body;

    const token = req.header("Authorization").split("Bearer ")[1];
    const email = jwt.decode(token).email;

    try {
      const usuario = await obtenerDatosUsuario(email);
      const idUsuario = usuario.id;

      await vender(idUsuario, titulo, formato, imagen, precio);

      res.status(201).send("¡Producto agregado!");
    } catch (errorObtenerUsuario) {
      console.error(errorObtenerUsuario);
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(PORT, console.log(`¡Servidor ON en el puerto: ${PORT}!`));

module.exports = app