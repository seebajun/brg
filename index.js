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

const { checkearCredenciales, verificarToken } = require("./middlewares.js");

const PORT = 3001;

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
//login
app.post("/login", checkearCredenciales, async (req, res) => {
  res.contentType("application/json");

  try {
    const { email, password } = req.body;
    const usuario = await verificarCredenciales(email, password);
    console.log("hola");
    console.log(usuario);
    const token = jwt.sign({ email }, "llaveSecreta");
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

// landing
app.get("/landing", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    const data = result.rows;

    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos de la base de datos', error);
    res.status(500).send('Error interno del servidor');
  }
});

//perfil
app.get("/perfil", async (req, res) => {
  
})

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
