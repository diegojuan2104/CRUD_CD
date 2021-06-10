const express = require('express');
const router = express.Router();

const { verifyToken, logIn } = require('./autenticacion');
/*Enruta todos los controladores,creando los endpoints.*/
router
	//Middelware
	.use(verifyToken)

	.post('/login', logIn);

module.exports = router;