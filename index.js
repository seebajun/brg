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
  consultarLikesPorUsuario,
  eliminarFavorito,
  agregarProductoAFavoritos,
  consultarProductosPorUsuario,
} = require("./consultas.js");

const { checkearCredenciales, verificarToken } = require("./middlewares.js");

const PORT = 2999;

app.use(express.json());
app.use(cors());

app.get("/auth", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send({ error: "Error al procesar la solicitud" });  }
});

app.post("/login", checkearCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await verificarCredenciales(email, password);
    console.log("Usuario:", usuario);
    const token = jwt.sign({ email }, "llaveSecreta", { expiresIn: "1h" });
    console.log("Token:", token);
    res.send(token);
  } catch (error) {
    res.status(500).send(error);
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

app.get("/landing", verificarToken, async (req, res) => {
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
    if (usuario) {
      delete usuario.password;
    }
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
    const { titulo, descripcion, formato, imagen, precio } = req.body;
    const token = req.header("Authorization").split("Bearer ")[1];
    const email = jwt.decode(token).email;

    try {
      const usuario = await obtenerDatosUsuario(email);
      const idUsuario = usuario.id;

      await vender(idUsuario, titulo, descripcion, formato, imagen, precio);

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

app.get("/favoritos", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const email = jwt.decode(token).email;
    try {
      const usuario = await obtenerDatosUsuario(email);
      const idUsuario = usuario.id;
      const likesUsuario = await consultarLikesPorUsuario(idUsuario);
      res.json(likesUsuario);
    } catch (errorObtenerUsuario) {
      console.error(errorObtenerUsuario);
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/favoritos/:idProducto", verificarToken, async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    // Agrega lógica para obtener los favoritos por ID de producto
    const likesProducto = await consultarLikesPorUsuario(idProducto);
    res.json(likesProducto);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.delete("/favoritos/:idProducto", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const email = jwt.decode(token).email;
    const usuario = await obtenerDatosUsuario(email);
    const idUsuario = usuario.id;
    const idProducto = req.params.idProducto;
    const eliminado = await eliminarFavorito(idUsuario, idProducto);

    if (eliminado) {
      res.status(200).send("Favorito eliminado correctamente");
    } else {
      res.status(404).send("Favorito no encontrado para el usuario");
    }
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      res.status(404).send("Producto no encontrado");
    } else {
      res.status(500).send("Error interno del servidor");
    }
  }
});

app.post("/favoritos/:idProducto", verificarToken, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const email = jwt.decode(token).email;
    const usuario = await obtenerDatosUsuario(email);
    const idUsuario = usuario.id;
    const idProducto = req.params.idProducto;

    const agregado = await agregarProductoAFavoritos(idUsuario, idProducto);

    if (agregado) {
      res.status(201).send("Producto agregado a favoritos correctamente");
    } else {
      res.status(500).send("Error al agregar producto a favoritos");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get('/publicaciones', verificarToken, async (req, res) => {
  try {
    const token = req.header('Authorization').split('Bearer ')[1];
    const email = jwt.decode(token).email;
    
    try {
      const usuario = await obtenerDatosUsuario(email);
      const idUsuario = usuario.id;
      const postUsuario = await consultarProductosPorUsuario(idUsuario); // Asegúrate de tener esta función definida
      res.json(postUsuario);
    } catch (errorObtenerUsuario) {
      console.error(errorObtenerUsuario);
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, console.log(`¡Servidor ON en el puerto: ${PORT}!`));

module.exports = app;
