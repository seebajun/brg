const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
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

const vender = async (idUsuario, titulo, formato, imagen, precio) => {
  try {
    const consultaProducto = "INSERT INTO productos (id_usuario, titulo, formato, imagen, precio, vendido) VALUES ($1, $2, $3, $4, $5, false) RETURNING id";
    const valuesProducto = [idUsuario, titulo, formato, imagen, precio];
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

module.exports = {
  vender,
  consultarProducto,
  registrarUsuario,
  obtenerDatosUsuario,
  verificarCredenciales,
};
