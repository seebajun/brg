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
  const token = req.header("Authorization").split("Bearer ")[1];
  if (!token) {
    throw {
      code: 401,
      message: "se debe incluir el token en las cabeceras",
    };
  }
  const tokenValido = jwt.verify(token, "llaveSecreta");
  if (!tokenValido) throw { code: 401, message: "el token es invalido" };

  next();
};

module.exports = {checkearCredenciales, verificarToken};
