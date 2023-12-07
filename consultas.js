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

const crearUsuario = async (email, password) => {
  const consulta = "INSERT INTO usuarios (email, password) VALUES ($1, $2)";
  const values = [email, password];
  await pool.query(consulta, values);
};

const verificarCredenciales = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2";
  const values = [email, password];
  const { rowCount } = await pool.query(consulta, values);
  if (rowCount === 0)
    throw {
      code: 404,
      message: "No se encontró ningún usuario con estas credenciaels",
    };
};

const agregarProducto = async (titulo, formato, imagen, precio) => {
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
  agregarProducto,
  verificarCredenciales,
  registrarUsuario,
  consultarProducto,
  crearUsuario
};
