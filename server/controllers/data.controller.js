const pgService = require('../services/pg');
const _pg = new pgService();


let getDocumentTypes = async (req, res) => {
    try {
        let sql = 'SELECT * FROM id_types order by id';
        const data = await _pg.executeQuery(sql);
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
};

//GET: obtiene todos los tipos roles que existen

let getRoles = async (req, res) => {
    try {
        let sql = 'SELECT * FROM roles order by id';
        const data = await _pg.executeQuery(sql);
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
};


module.exports = { getRoles, getDocumentTypes }