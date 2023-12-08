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
} = require("./consultas.js");

const {
  checkearCredenciales,
  verificarToken
} = require("./middlewares.js")

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});
//login
app.post("/", checkearCredenciales, async  (req, res) => {

  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "llaveSecreta");
    res.send(token);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/registrarse", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/registrarse", async (req, res) => {
  try {
    console.log("hola");
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("usuario creado con exitos");
  } catch (error) {
    res.status(500).send(error);
  }
});

// landing
app.get("/landing", async (req, res) => {
  try {
  } catch (error) {}
});

// producto LISTA
app.get("/producto/:titulo", async (req, res) => {
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
// vender LISTA
app.post("/vender", async (req, res) => {
  try {
    const { titulo, formato, imagen, precio } = req.body;
    await vender(titulo, formato, imagen, precio);
    res.send("¡Producto agregado!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(PORT, console.log(`¡Servidor ON en el puerto: ${PORT}!`));
