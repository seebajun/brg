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
  if (req.header("Authorization")) {
    const token = req.header("Authorization").split("Bearer ")[1];
    if (!token) {
      return res.status(401).send("Usuario no autenticado");
    }

    const tokenValido = jwt.verify(token, "llaveSecreta");
    if (!tokenValido) return res.status(401).send("Usuario no autenticado");
  }
  next();
};

module.exports = { checkearCredenciales, verificarToken };
