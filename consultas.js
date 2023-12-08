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
  if (!passwordCorrecta || !rowCount) {
    throw { code: 404, message: "Email no encontrado" };
  }
};

const registrarUsuario = async (usuario) => {
  let {email, password} = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  const values = [email, passwordEncriptada]
  const consulta = "INSERT INTO usuarios values (DEFAULT, $1,$2)";
  await pool.query(consulta, values)
}; 

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordCorrecta || !rowCount) {
    throw { code: 401, message: "Email o contraseña incorrecta" };
  }
};

const vender = async (titulo, formato, imagen, precio) => {
  try {
    const consulta = "INSERT INTO productos values (DEFAULT, $1, $2, $3, $4)";
    const values = [titulo, formato, imagen, precio];
    const result = await pool.query(consulta, values);
    console.log("¡Ya se está vendiendo!");
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
    return null;
  }
};

module.exports = {
  vender,
  consultarProducto,
  registrarUsuario,
  obtenerDatosUsuario,
  verificarCredenciales
};
