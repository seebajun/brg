const jwt = require("jsonwebtoken");

const checkearCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(401)
      .send({ menssage: "No se recibieron las credenciales en esta consulta" });
  }
  next();
};
const verificarToken = (req, res, next) => {
  const token = req.header("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).send("Usuario no autenticado");
  }

  try {
    const decoded = jwt.verify(token, "llaveSecreta");
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Usuario no autenticado");
  }
};

module.exports = { checkearCredenciales, verificarToken };
