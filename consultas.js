const jwt = require('jsonwebtoken')
const {Pool} = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'retrogroove',
    allowExitOnIdle: true
})

5432

const getDate = async () => {
    const result = await pool.query("SELECT NOW()")
    console.log(result);
};

const verificarCredenciales = async (email, password) =>{
    const consulta = "Select * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const {rowCount} = await pool.query(consulta, values)
    if (!rowCount) throw {code: 404, nessage: "No se encontró ningún usuario con estas credenciaels"} 
}

const agregarProducto = async (titulo, formato, imagen, precio) =>{
    const consulta = "INSERT INTO productos values (DEFAULT, $1,$2,$3,$4)"
    const values = [titulo, formato, imagen, precio]
    const result = await pool.query(consulta, values)
    console.log("¡Ya se está vendiendo!")
};

const consultarProducto = async (titulo, formato, imagen, precio) =>{
    const consulta = "SELECT "
}

module.exports = {agregarProducto, verificarCredenciales, consultarProducto}