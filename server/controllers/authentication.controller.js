const jwt = require("jsonwebtoken");
const pgService = require("../services/pg");
const _pg = new pgService();


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
       //Sign JWT
    const payload = {
      user: {
        id: data.id,
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
        return res.json({token, role: data.role, });
      }
    );

    } else {
      res.status(400).send({ ok: false, mensaje: "id or password incorrect" });
    }
  } catch (error) {
    console.log(error);
	res.status(500).send({ ok: false, mensaje: "Internal error" });
  }
};



module.exports = { logIn };
