const pgService = require("../services/pg");
const _pg = new pgService();

let getAllUsers = async (req, res) => {
  try {
    let sql = "SELECT * FROM users order by id";
    const data = await _pg.executeQuery(sql);
    res.status(200).send(data.rows);
  } catch (error) {
    res.status(404).send(error);
  }
};

let getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if ((await getUser(id)).length == 0) {
      res.status(404).send("User not founded");
      return;
    }
    res.status(200).send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

let getUser = async (id) => {
  let sql = "SELECT * FROM users WHERE id = $1 order by id";
  let values = [id];
  const data = await _pg.executeQuery(sql, values);
  return data.rows;
};

let postUser = async (req, res) => {
  try {
    const info = req.body;

    if ((await getUser(info.id)).length > 0) {
      console.log("IN");
      res.status(404).send("This user already exists");
    }

    validarInformacion(info);
    let sql =
      "INSERT INTO users(id,id_type,name,lastname,phone,email,rol,password) VALUES ($1,$2,$3,$4,$5,$6,$7,md5($8));";
    let values = [
      info.id,
      info.id_type,
      info.name,
      info.lastname,
      info.phone,
      info.email,
      info.rol,
      info.password,
    ];
    await _pg.executeQuery(sql, values);
    res.status(200).send("User created");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

let putUser = async (req, res) => {
  try {
    if ((await getUser(id)).length == 0) {
      res.status(404).send("User not founded");
      return;
    }
    const info = req.body;
    const id = req.params.id;
    let sql = `UPDATE users SET 
            id_type = $1, name = $2,lastname = $3, 
            phone = $4, email = $5, rol = $6 
            WHERE id = $7;`;
    let values = [
      info.id_type,
      info.name,
      info.last_name,
      info.phone,
      info.email,
      info.rol,
      id,
    ];
    await _pg.executeQuery(sql, values);
    res.status(200).send("User updated");
  } catch (error) {
    res.status(404).send(error);
  }
};

let deleteUser = async (req, res) => {
  try {
    const info = req.body;
    const id = req.params.id;
    console.log(info);
    let sql = "DELETE FROM users WHERE id = $1;";
    let values = [id];
    await _pg.executeQuery(sql, values);
    res.status(200).send("User Deleted");
  } catch (error) {
    res.status(404).send(error);
  }
};

let validarInformacion = (info) => {
  if (
    !info.id_type ||
    !info.id ||
    !info.name ||
    !info.lastname ||
    !info.phone ||
    !info.email ||
    !info.rol ||
    !info.password
  ) {
    throw {
      ok: false,
      mensaje: "Must fill all the fields",
    };
  }
};

module.exports = { getAllUsers, postUser, putUser, deleteUser, getUserById };
