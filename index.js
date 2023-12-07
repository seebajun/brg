const {
  agregarProducto,
  verificarCredenciales,
  consultarProducto,
  crearUsuario,
} = require("./consultas.js");

const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cors = require("cors");

PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { email, password } = req.query;
    if (!email || !password) {
      throw {
        code: 400,
        message: "El email y la contraseña son obligatorios",
      };
    }
    await verificarCredenciales(email, password);
    res.send("Usuario creado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send(error.message || "Error interno del servidor");
  }
});

//listo
app.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    await crearUsuario(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message || "Error interno del servidor");
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
    await agregarProducto(titulo, formato, imagen, precio);
    res.send("¡Producto agregado!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(PORT, console.log(`¡Servidor ON en el puerto: ${PORT}!`));
