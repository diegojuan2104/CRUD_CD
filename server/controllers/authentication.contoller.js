const jwt = require("jsonwebtoken");
const pgService = require("../services/pg");
const _pg = new pgService();

const secret_key = "2783815c5c6fadfcb4d79d92adeca7ad";

let validation = (info) => {
  if (!info.id || !info.password) {
    throw {
      ok: false,
      mensaje: "Must fill all the fields",
    };
  }
};

let logIn = async (req, res) => {
  try {
    const info = req.body;
    validation(info);

    let sql = "SELECT * FROM users WHERE id = $1 AND password = md5($2)";
    let values = [info.id, info.password];
    const data = await _pg.executeQuery(sql, values);

    if (data.rowCount > 0) {
      let token = newToken(data.rows[0]);
      res.status(200).send({
        ok: true,
        mensaje: "User authenticated",
        token: token,
        User: { id: data.rows[0].id, rol: data.rows[0].rol },
      });
    } else {
      res.status(400).send({ ok: false, mensaje: "User or password incorrect" });
    }
  } catch (error) {
	res.status(500).send({ ok: false, mensaje: "Internal error" });
  }
};


let verifyToken = (req, res, next) => {
  try {
    let url = req.url;
    if (url != "/login") {
      let token = req.headers.token;
      jwt.verify(token, secret_key);
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ ok: false, mensaje: "Invalid token", info: error });
  }
};

let newToken = (user) => {
  delete user.password;
  let token = jwt.sign(user, secret_key);
  return token;
};

module.exports = { verificarToken: verifyToken, logIn };
