const express = require('express');
const router = express.Router();

const { logIn } = require('../controllers/authentication.controller');

router

	.post('/login', logIn);

module.exports = router;