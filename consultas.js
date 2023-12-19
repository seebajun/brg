const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2833",
  database: "retrogroove",
  port: 5432,
  allowExitOnIdle: true,
});

const obtenerDatosUsuario = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (!usuario || !rowCount) {
    throw { code: 404, message: "Email no encontrado" };
  }

  return usuario;
};

const registrarUsuario = async (usuario) => {
  let { nombre, apellido, email, password } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  const values = [nombre, apellido, email, passwordEncriptada];
  const consulta =
    "INSERT INTO usuarios(id, nombre, apellido, email, password) values (DEFAULT, $1,$2, $3, $4)";
  await pool.query(consulta, values);
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const response = await pool.query(consulta, values);
  console.log(response);
  if (response.rowCount <= 0) {
    throw new Error("Email o password incorrecta");
  }
  const usuario = response.rows[0];
  if (!bcrypt.compareSync(password, usuario.password)) {
    throw new Error("Email o password incorrecta");
  }

  return usuario;
};

const vender = async (idUsuario, titulo, descripcion, formato, imagen, precio) => {
  try {
    const consultaProducto = "INSERT INTO productos (id_usuario, titulo, descripcion, formato, imagen, precio, vendido) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id";
    const valuesProducto = [idUsuario, titulo, descripcion, formato, imagen, precio];
    const resultProducto = await pool.query(consultaProducto, valuesProducto);

    if (resultProducto.rows[0]) {
      const idProducto = resultProducto.rows[0].id;
      console.log("¡Se agrega producto con éxito!");
    } else {
      console.error("Error al agregar producto: Resultado no tiene filas");
    }
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw error;
  }
};

const consultarProducto = async (titulo) => {
  const consulta = "SELECT * FROM productos WHERE titulo = $1";
  const values = [titulo];
  const result = await pool.query(consulta, values);

  if (result.rows.length > 0) {
    return result.rows[0];
  }
};

const consultarProductos = async () => {
  const consulta = "SELECT * FROM productos";
  const result = await pool.query(consulta);

  if (result.rows.length > 0) {
    return result.rows;
  }
}

const consultarLikesPorUsuario = async (idUsuario) => {
  const consulta =
    "SELECT ul.id_productos, p.titulo, p.descripcion, p.formato, p.imagen, p.precio FROM usuarios_likes ul JOIN productos p ON ul.id_productos = p.id WHERE ul.id_usuarios = $1";
  const values = [idUsuario];
  const result = await pool.query(consulta, values);
  return result.rows;
};

const eliminarFavorito = async (idUsuario, idProducto) => {
  const consulta =
    "DELETE FROM usuarios_likes WHERE id_usuarios = $1 AND id_productos = $2";
  const values = [idUsuario, idProducto];

  try {
    const result = await pool.query(consulta, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    throw error;
  }
};

const borrarProducto = async (idProducto) => {
  const consulta = "DELETE FROM productos WHERE id = $1";
  const values = [idProducto];

  try {
    const result = await pool.query(consulta, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

const agregarProductoAFavoritos = async (idUsuario, idProducto) => {
  const consulta =
    "INSERT INTO usuarios_likes (id_usuarios, id_productos) VALUES ($1, $2)";
  const values = [idUsuario, idProducto];

  try {
    const result = await pool.query(consulta, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error al agregar producto a favoritos:", error);
    throw error;
  }
};

const consultarProductosPorUsuario = async (idUsuario) => {
  const consulta = `
    SELECT *
      FROM productos
     WHERE id_usuario = $1`;
  const values = [idUsuario];
  const result = await pool.query(consulta, values);
  return result.rows;
};

module.exports = {
  vender,
  consultarProducto,
  registrarUsuario,
  obtenerDatosUsuario,
  verificarCredenciales,
  consultarProductos,
  consultarLikesPorUsuario,
  eliminarFavorito,
  borrarProducto,
  agregarProductoAFavoritos,
  consultarProductosPorUsuario
};
