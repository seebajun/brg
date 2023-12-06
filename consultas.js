const jwt = require('jsonwebtoken')
const {Pool} = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'catalogo_productos',
    allowExitOnIdle: true
})

const getDate = async () => {
    const result = await pool.query("SELECT NOW()")
    console.log(result);
};

const agregarProducto = async (titulo, formato, imagen, precio) =>{
    const consulta = "INSERT INTO productos values (DEFAULT, $1,$2,$3,$4)"
    const values = [titulo, formato, imagen, precio]
    const result = await pool.query(consulta, values)
    console.log("¡Ya se está vendiendo!")
};

module.exports = {agregarProducto}