const jwt = require("jsonwebtoken");
const pgService = require("../services/pg");
const _pg = new pgService();

let logIn = async (req, res) => {
  try {
    const info = req.body;
    if (!validation(info)) {
      return res.status(400).json({
        msg: "Must fill all the fields",
      });
    }

    let sql = "SELECT * FROM users WHERE email = $1 AND password = md5($2)";
    let values = [info.email, info.password];
    const data = await _pg.executeQuery(sql, values);

    if (data.rowCount > 0) {
      //Sign JWT
      const payload = {
        user: {
          email: data.rows[0].email,
          rol:data.rows[0].email,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: 3600000,
        },
        (error, token) => {
          if (error) throw error;
          return res.json({ token, role: data.rows[0].rol });
        }
      );
    } else {
      res
        .status(400)
        .send({ ok: false, mensaje: "Email or password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, msg: "Internal error" });
  }
};

let validation = (info) => {
  if (!info.email || !info.password) {
    return false;
  } else {
    return true;
  }
};

module.exports = { logIn };
