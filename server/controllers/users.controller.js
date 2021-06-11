const pgService = require("../services/pg");
const _pg = new pgService();

let getAllUsers = async (req, res) => {
  try {
    if (req.user.rol === 3) {
      res.status(403).send("User not allowed to do this petition");
      return;
    }

    let sql = `SELECT users.id, users.email, id_types.type as id_type, users.name, users.lastname, users.phone,roles.type as rol FROM users inner join roles on users.rol = roles.id inner
    join id_types on users.id_type = id_types.id`;
    const data = await _pg.executeQuery(sql);
    res.status(200).send(data.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

let getAuthenticatedUser = async (req, res) => {
  try {
    const email = req.user.email;
    const data = await getUserByEmail(email);
    if (data.length == 0) {
      res.status(404).send("User not founded");
      return;
    }
    res.status(200).send(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

let getUserByEmail = async (email) => {
  console.log(email);
  let sql = `SELECT users.id, users.email, id_types.type as id_type, users.name, users.lastname, users.phone,roles.type as rol FROM users inner join roles on users.rol = roles.id inner
  join id_types on users.id_type = id_types.id where users.email = $1`;
  let values = [email];
  const data = await _pg.executeQuery(sql, values);
  return data.rows;
};

let postUser = async (req, res) => {
  try {
    const info = req.body;
    if (!validation(info)) {
      return res.status(400).json({
        msg: "Must fill all the fields",
      });
    }
    if ((await getUserByEmail(info.email)).length > 0) {
      return res.status(400).json({
        msg: "This user already exists",
      });
    }

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
    res.status(500).send("Internal error");
  }
};

let putUser = async (req, res) => {
  try {
    if (req.user.rol === 3) {
      res.status(403).send("User not allowed to do this petition");
      return;
    }
    const info = req.body.user;
 
    if ((await getUserByEmail(info.email)).length == 0) {
      res.status(404).send("User not found");
      return;
    }
    
    let sql = `UPDATE public.users
    SET id=$1, id_type=$2, name=$3, lastname=$4,rol=$5, phone=$6
    WHERE email = $7`;
    let values = [
      info.id,
      info.id_type,
      info.name,
      info.lastname,
      info.rol,
      info.phone,
      info.email,
    ];
    const val = await _pg.executeQuery(sql, values);
    res.status(200).send("User updated");
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal error");
  }
};

let deleteUser = async (req, res) => {
  try {
    if (req.user.rol === 3 || req.user.rol === 2) {
      res.status(403).send("User not allowed to do this petition");
      return;
    }

    const email = req.params.id;
    console.log(email);
    let sql = "DELETE FROM users WHERE email = $1;";
    let values = [email];
    await _pg.executeQuery(sql, values);
    res.status(200).send("User Deleted");
  } catch (error) {
    res.status(404).send(error);
  }
};

let validation = (info) => {
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
    return false;
  } else {
    return true;
  }
};

module.exports = {
  getAllUsers,
  postUser,
  putUser,
  deleteUser,
  getAuthenticatedUser,
};
