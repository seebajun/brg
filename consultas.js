const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "retrogroove",
  password: "retro1234",
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
  if (!passwordCorrecta || !rowCount) {
    throw { code: 404, message: "Email no encontrado" };
  }
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
  console.log("hola");
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const response = await pool.query(consulta, values);
  console.log("hola1", response);
  if (response.rowCount <= 0) {
    throw new Error("Email o password incorrecta");
  }

  const usuario = response.rows;

  if (bcrypt.compareSync(password, usuario.password)) {
    throw new Error("Email o password incorrecta");
  }

  return usuario;
};

const vender = async (titulo, formato, imagen, precio) => {
  try {
    const consulta = "INSERT INTO productos values (DEFAULT, $1, $2, $3, $4)";
    const values = [titulo, formato, imagen, precio];
    const result = await pool.query(consulta, values);
    console.log("¡Ya se está vendiendo!" + result.rowCount);
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
