const {
  agregarProducto,
  verificarCredenciales,
  consultarProducto,
} = require("./consultas.js");

const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

PORT = 3000;

app.use(express.json());
app.use(cors());

// login
app.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sing({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

// landing
app.get("/landing", async (req, res) => {
  try {
  } catch (error) {}
});

// producto
app.get("/producto:titulo", async (req, res) => {
  try {
    const { titulo } = req.params;
    const consultarProducto = productos.find(
      (producto) => producto.titulo === titulo
    );
    is(consultarProducto);
    return res.json(movie);
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
});
// vender
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

app.listen(PORT, console.log(`¡Servidor ON en el puerto: ${port}!`));
